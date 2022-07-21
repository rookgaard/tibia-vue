import LZString from 'lz-string'
import axios from 'axios'
import {BufferReader} from '@/shared/bufferReader'
import data from '@/shared/data.json'

if (!localStorage.getItem('datFile')) {
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
	msg.skipBytes(4);
	const itemCount = msg.getUInt16();
	msg.skipBytes(6);

	const output = [];
	// let id = 100;
	type unk = {
		[key: string]: any;
	};
	const m_thingTypes = [];

	for (let i = 0; i < itemCount; i++) {
		const thing = JSON.parse(JSON.stringify(data.ThingType));
		let count = 0, attr = -1, done = false;

		for (let j = 0; j < data.headers.ThingLastAttr; j++) {
			count++;
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
					const light = {
						intensity: msg.getUInt16(),
						color: msg.getUInt16()
					};
					thing.attributes[attr] = light;
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
			console.log(`corrupt data (i: ${i}, count: ${count}, lastAttr: ${attr})`);
		}

		const groupCount = 1;
		thing.animPh = 0;
		let totalSpritesCount = 0;

		for (let j = 0; j < groupCount; ++j) {
			const width = msg.getByte();
			const height = msg.getByte();
			thing.m_size = [width, height];

			if (width > 1 || height > 1) {
				thing.realSize = msg.getByte();
				thing.exactSize = Math.min(thing.realSize, Math.max(width * 32, height * 32));
			} else {
				thing.exactSize = 32;
			}

			thing.layers = msg.getByte();
			thing.patX = msg.getByte();
			thing.patY = msg.getByte();
			thing.patZ = msg.getByte();
			const groupAnimationsPhases = msg.getByte();
			thing.animPh += groupAnimationsPhases;

			const totalSprites = thing.m_size[0] * thing.m_size[1] * thing.layers * thing.patX * thing.patY * thing.patZ * groupAnimationsPhases;

			if ((totalSpritesCount + totalSprites) > 4096) {
				console.log("a thing type has more than 4096 sprites", totalSpritesCount, totalSpritesCount + totalSprites);
			}

			thing.sprites = new Array((totalSpritesCount + totalSprites));

			for (let k = totalSpritesCount; k < (totalSpritesCount + totalSprites); k++) {
				thing.sprites[k] = msg.getUInt16();
			}

			totalSpritesCount += totalSprites;
		}

		m_thingTypes[i + 100] = thing;
	}

	localStorage.setItem('datFile', LZString.compress(JSON.stringify(m_thingTypes)));
}
