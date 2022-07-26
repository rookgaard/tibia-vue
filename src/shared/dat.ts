import LZString from 'lz-string'
import axios from 'axios'
import {BufferReader} from '@/shared/bufferReader'
import data from '@/shared/data.json'

try {
	// localStorage.removeItem('datFile');
	JSON.parse(LZString.decompress(localStorage.getItem('datFile') ?? '') ?? '');
} catch (e) {
	axios({
		url: 'https://client.rookgaard.pl/860/Tibia.dat',
		method: 'GET',
		responseType: 'arraybuffer',
	}).then(
		function (response) {
			parseDat(response.data);
		}
	);
}

function parseDat(content: Uint8Array) {
	const msg = new BufferReader(content);
	msg.skipBytes(4); // signature
	const itemCount = msg.getUInt16();
	msg.skipBytes(6); // other categories

	type unk = {
		[key: string]: any;
	};
	const things = [];

	for (let i = 0; i < itemCount; i++) {
		const thing = JSON.parse(JSON.stringify(data.ThingType));
		let attr = -1, done = false;

		for (let j = 0; j < data.headers.ThingLastAttr; j++) {
			attr = msg.getByte();

			if (attr === data.headers.ThingLastAttr) {
				done = true;
				break;
			}

			switch (attr) {
				case data.headers.ThingAttrDisplacement: { // 24
					thing.displacement.x = msg.getUInt16();
					thing.displacement.y = msg.getUInt16();
					thing.attributes[attr] = true;
					break;
				}
				case data.headers.ThingAttrLight: { // 21
					thing.attributes[attr] = {
						intensity: msg.getUInt16(),
						color: msg.getUInt16()
					};
					break;
				}
				case data.headers.ThingAttrMarket: { // 33
					const market: unk = {
						category: msg.getUInt16(),
						tradeAs: msg.getUInt16(),
						showAs: msg.getUInt16(),
					}
					const length = msg.getUInt16();
					// const start = bufferPosition - 3;
					// const end = start + length + 3;
					market.name = msg.getString();
					market.restrictVocation = msg.getUInt16();
					market.requiredLevel = msg.getUInt16();
					thing.attributes[attr] = market;
					break;
				}
				case data.headers.ThingAttrElevation: { // 25
					thing.elevation = msg.getUInt16();
					thing.attributes[attr] = thing.elevation;
					break;
				}
				case data.headers.ThingAttrGround: // 0
				case data.headers.ThingAttrWritable: // 8
				case data.headers.ThingAttrWritableOnce: // 9
				case data.headers.ThingAttrMinimapColor: // 28
				case data.headers.ThingAttrLensHelp: // 29
				case data.headers.ThingAttrCloth: // 32
				case data.headers.ThingAttrUsable: // 34
				{
					thing.attributes[attr] = msg.getUInt16();
					break;
				}
				default: {
					thing.attributes[attr] = true;
					break;
				}
			}
		}

		if (!done) {
			console.log(`corrupted data (i: ${i}, lastAttr: ${attr})`);
		}

		const groupCount = 1;
		thing.animPh = 0;
		let totalSpritesCount = 0;

		for (let j = 0; j < groupCount; ++j) {
			thing.width = msg.getByte();
			thing.height = msg.getByte();

			if (thing.width > 1 || thing.height > 1) {
				thing.realSize = msg.getByte();
				thing.exactSize = Math.min(thing.realSize, Math.max(thing.width * 32, thing.height * 32));
			} else {
				thing.exactSize = 32;
			}

			thing.layers = msg.getByte();
			thing.patX = msg.getByte();
			thing.patY = msg.getByte();
			thing.patZ = msg.getByte();
			const groupAnimationsPhases = msg.getByte();
			thing.animPh += groupAnimationsPhases;

			const totalSprites = thing.width * thing.height * thing.layers * thing.patX * thing.patY * thing.patZ * groupAnimationsPhases;

			if ((totalSpritesCount + totalSprites) > 4096) {
				console.log("a thing type has more than 4096 sprites", totalSpritesCount, totalSpritesCount + totalSprites);
			}

			thing.sprites = new Array((totalSpritesCount + totalSprites));

			for (let k = totalSpritesCount; k < (totalSpritesCount + totalSprites); k++) {
				thing.sprites[k] = msg.getUInt16();
			}

			totalSpritesCount += totalSprites;
		}

		things[i + 100] = thing;
	}

	localStorage.setItem('datFile', LZString.compress(JSON.stringify(things)));
}
