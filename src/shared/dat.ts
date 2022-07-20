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
// } else {
// 	console.log(JSON.parse(LZString.decompress(localStorage.getItem('datFile') ?? '') ?? ''));
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
		const ThingTypePtr = JSON.parse(JSON.stringify(data.ThingType));
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
					ThingTypePtr.m_displacement.x = msg.getUInt16();
					ThingTypePtr.m_displacement.y = msg.getUInt16();
					ThingTypePtr.m_attribs[attr] = true;
					break;
				}
				case data.headers.ThingAttrLight: { // 21
					const light = {
						intensity: msg.getUInt16(),
						color: msg.getUInt16()
					};
					ThingTypePtr.m_attribs[attr] = light;
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
					ThingTypePtr.m_attribs[attr] = market;
					break;
				}
				case data.headers.ThingAttrElevation: { // 25
					ThingTypePtr.m_elevation = msg.getUInt16();
					ThingTypePtr.m_attribs[attr] = ThingTypePtr.m_elevation;
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
					ThingTypePtr.m_attribs[attr] = msg.getUInt16();
					break;
				}
				default: {
					ThingTypePtr.m_attribs[attr] = true;
					break;
				}
			}
		}

		if (!done) {
			console.log(`corrupt data (i: ${i}, count: ${count}, lastAttr: ${attr})`);
		}

		const groupCount = 1;
		ThingTypePtr.m_animationPhases = 0;
		let totalSpritesCount = 0;

		for (let j = 0; j < groupCount; ++j) {
			const width = msg.getByte();
			const height = msg.getByte();
			ThingTypePtr.m_size = [width, height];

			if (width > 1 || height > 1) {
				ThingTypePtr.m_realSize = msg.getByte();
				ThingTypePtr.m_exactSize = Math.min(ThingTypePtr.m_realSize, Math.max(width * 32, height * 32));
			} else {
				ThingTypePtr.m_exactSize = 32;
			}

			ThingTypePtr.m_layers = msg.getByte();
			ThingTypePtr.m_numPatternX = msg.getByte();
			ThingTypePtr.m_numPatternY = msg.getByte();
			ThingTypePtr.m_numPatternZ = msg.getByte();
			const groupAnimationsPhases = msg.getByte();
			ThingTypePtr.m_animationPhases += groupAnimationsPhases;

			const totalSprites = ThingTypePtr.m_size[0] * ThingTypePtr.m_size[1] * ThingTypePtr.m_layers * ThingTypePtr.m_numPatternX * ThingTypePtr.m_numPatternY * ThingTypePtr.m_numPatternZ * groupAnimationsPhases;

			if ((totalSpritesCount + totalSprites) > 4096) {
				console.log("a thing type has more than 4096 sprites", totalSpritesCount, totalSpritesCount + totalSprites);
			}

			ThingTypePtr.m_spritesIndex = new Array((totalSpritesCount + totalSprites));

			for (let k = totalSpritesCount; k < (totalSpritesCount + totalSprites); k++) {
				ThingTypePtr.m_spritesIndex[k] = msg.getUInt16();
			}

			totalSpritesCount += totalSprites;
		}

		m_thingTypes[i + 100] = ThingTypePtr;
	}

	localStorage.setItem('datFile', LZString.compress(JSON.stringify(m_thingTypes)));
}
