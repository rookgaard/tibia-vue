import {BufferReader} from '@/shared/bufferReader';
import LZString from "lz-string";

// const itemMap = JSON.parse(LZString.decompress(localStorage.getItem('itemMap') ?? '') ?? '');
const itemMap = JSON.parse(LZString.decompress(localStorage.getItem('datFile') ?? '') ?? '');
type unk = {
	[key: string]: any;
};

function getPosition(msg: BufferReader) {
	return {
		x: msg.getUInt16(),
		y: msg.getUInt16(),
		z: msg.getByte()
	};
}

//10
function parseLogin(msg: BufferReader) {
	msg.getUInt32(); // creature ID
	msg.getUInt16(); // beat duration
	msg.getByte(); // canReportBugs
}

//22
function parseLoginWait(msg: BufferReader) {
	const message = msg.getString();
	const time = msg.getByte();
	console.log('parseLoginWait', message, time);
}

//105
function parseUpdateTile(msg: BufferReader, gameMap: any) {
	const pos = getPosition(msg);
	setTileDescription(msg, gameMap, pos);
}

//106
function parseTileAddThing(msg: BufferReader) {
	getPosition(msg);
	msg.getByte(); //stackPos
	getThing(msg);
}

//107
function parseTileTransformThing(msg: BufferReader) {
	getMappedThing(msg);
	getThing(msg);
}

//108
function parseTileRemoveThing(msg: BufferReader) {
	getMappedThing(msg);
}

//109
function parseCreatureMove(msg: BufferReader) {
	getMappedThing(msg);
	getPosition(msg);
//	console.log('parseCreatureMove', lastPos);
}

//110
function parseOpenContainer(msg: BufferReader) {
	msg.getByte(); //containerId
	getItem(msg); //containerItem
	msg.getString(); //name
	msg.getByte(); //capacity
	const hasParent = (msg.getByte() != 0);
	const itemCount = msg.getByte();
	for (let i = 0; i < itemCount; i++) {
		getItem(msg);
	}
}

//111
function parseCloseContainer(msg: BufferReader) {
	msg.getByte(); //containerId
}

//112
function parseContainerAddItem(msg: BufferReader) {
	msg.getByte(); //containerId
	getItem(msg);
}

//113
function parseContainerUpdateItem(msg: BufferReader) {
	msg.getByte(); //containerId
	msg.getByte(); //slot
	getItem(msg);
}

//114
function parseContainerRemoveItem(msg: BufferReader) {
	msg.getByte(); //containerId
	msg.getByte(); //slot
}

//120
function parseAddInventoryItem(msg: BufferReader) {
	msg.getByte(); //slot
	getItem(msg);
}

//121
function parseRemoveInventoryItem(msg: BufferReader) {
	msg.getByte(); //slot
}

//122
function parseOpenNpcTrade(msg: BufferReader) {
	const listCount = msg.getByte();

	for (let i = 0; i < listCount; ++i) {
		msg.getUInt16(); // itemId
		msg.getByte(); //count
		msg.getString(); // name
		msg.getUInt32(); // weight
		msg.getUInt32(); // buy price
		msg.getUInt32(); // sell price
	}
}

//130
function parseWorldLight(msg: BufferReader) {
	const light = {
		intensity: msg.getByte(),
		color: msg.getByte()
	};
}

//131
function parseMagicEffect(msg: BufferReader) {
	getPosition(msg);
	msg.getByte(); // type
}

//132
function parseAnimatedText(msg: BufferReader) {
	const position = getPosition(msg);
	const color = msg.getByte();
	const text = msg.getString();
}

//134
function parseCreatureMark(msg: BufferReader) {
	const id = msg.getUInt32();
	const color = msg.getByte();
}

//140
function parseCreatureHealth(msg: BufferReader) {
	const id = msg.getUInt32();
	const healthPercent = msg.getByte();
}

//141
function parseCreatureLight(msg: BufferReader) {
	msg.getUInt32(); // id
	const light = {
		intensity: msg.getByte(),
		color: msg.getByte()
	};
}

//143
function parseCreatureSpeed(msg: BufferReader) {
	msg.getUInt32(); // id
	msg.getUInt16(); // speed
}

//160
function parsePlayerStats(msg: BufferReader) {
	msg.getUInt16(); // health
	msg.getUInt16(); // maxHealth
	msg.getUInt32(); // free capacity
	msg.getUInt32(); // experience
	msg.getUInt16(); // level
	msg.getByte(); // level percent
	msg.getUInt16(); // mana
	msg.getUInt16(); // maxMana
	msg.getByte(); // magic level
	msg.getByte(); // magic level percent
	msg.getByte(); // soul
	msg.getUInt16(); // stamina
}

//161
function parsePlayerSkills(msg: BufferReader) {
	for (let skill = 0; skill < 7; skill++) {
		msg.getByte(); // level
		msg.getByte(); // level percent
	}
}

//162
function parsePlayerIcons(msg: BufferReader) {
	msg.getUInt16(); // icons
}

//170
function parseTalk(msg: BufferReader) {
	msg.getUInt32();// channel statement guid
	const name = msg.getString();
	const level = msg.getUInt16();
	const mode = msg.getByte();

	switch (mode) {
		case 1:
		case 2:
		case 3:
		case 44:
		case 43:
		case 11:
		case 34:
		case 35:
		case 9:
		case 41:
		case 19:
			getPosition(msg);
			break;
		case 7:
		case 6:
		case 8:
		case 13:
			msg.getUInt16();

			break;
		case 10:
		case 4:
		case 12:
		case 14:
		case 48:
		case 49:
			break;
		case 47:
			msg.getUInt32();

			break;
		default:
			console.log("unknown message mode", mode);
			break;
	}

	const text = msg.getString();
	console.log(name, level, mode, text);
}

//172
function parseOpenChannel(msg: BufferReader) {
	msg.getUInt16(); // channel id
	msg.getString(); // channel name
}

//180
function parseTextMessage(msg: BufferReader) {
	const mode = msg.getByte();
	console.log(`parseTextMessage, mode: ${mode}`);
	let text;

	switch (mode) {
		case 6:
		case 31:
		case 32:
		case 33:
			msg.getUInt16(); // channel
			text = msg.getString();
			break;
		case 21:
		case 22:
		case 25:
			getPosition(msg);
			msg.getUInt32(); // physical damage
			msg.getByte(); // color
			msg.getUInt32(); // magical damage
			msg.getByte(); // color
			text = msg.getString();
			break;
		case 23:
		case 24:
		case 26:
		case 27:
		case 41:
//			console.log(getPosition(msg));
//			msg.getUInt32(); // physical damage
//
//			msg.getByte(); // color
//
			text = msg.getString();
			break;
		case 255:
			console.log(`unknown message mode: ${mode}`);
			break;
		default:
			text = msg.getString();
			break;
	}

	console.log(text);
}

//210
function parseVipAdd(msg: BufferReader) {
	const iconId = 0;
	let desc;
	const notifyLogin = false;

	const id = msg.getUInt32();
	const name = msg.getString();
	const status = msg.getByte();
}

function getMappedThing(msg: BufferReader) {
	const x = msg.getUInt16();
//		console.log('getMappedThing x', x);

	if (x !== 0xffff) {
		const msgPosition = [
			x,
			msg.getUInt16(),
			msg.getByte(),
			msg.getByte()
		];
//			console.log(msgPosition);
	} else {
//			console.log(msg.getUInt32());
	}
}

function setMapDescription(msg: BufferReader, gameMap: any, x: number, y: number, z: number, width: number, height: number) {
	let startz;
	let endz;
	let zstep;

	if (z > 7) {
		startz = z - 2;
		endz = Math.min(z + 2, 15);
		zstep = 1;
	} else {
		startz = 7;
		endz = 0;
		zstep = -1;
	}

	let skip = 0;

	for (let nz = startz; nz !== endz + zstep; nz += zstep) {
		skip = setFloorDescription(msg, gameMap, x, y, nz, width, height, z - nz, skip);
	}
}

function setFloorDescription(msg: BufferReader, gameMap: any, x: number, y: number, z: number, width: number, height: number, offset: number, skip: number) {
	for (let nx = 0; nx < width; nx++) {
		for (let ny = 0; ny < height; ny++) {
			const tilePos = {x: x + nx + offset, y: y + ny + offset, z: z};

			if (skip === 0) {
				skip = setTileDescription(msg, gameMap, tilePos);
			} else {
				if (gameMap[tilePos.z]) {
					delete gameMap[tilePos.z][tilePos.y + '_' + tilePos.x];
				}

				skip--;
			}
		}
	}

	return skip;
}

function setTileDescription(msg: BufferReader, gameMap: any, position: any) {
	if (gameMap[position.z]) {
		delete gameMap[position.z][position.y + '_' + position.x];
	}

	const gotEffect = false;

	for (let stackPos = 0; stackPos < 256; stackPos++) {
		const peek = msg.peekUInt16();

		if (peek >= 0xff00) {
			return msg.getUInt16() & 0xff;
		}

		if (stackPos > 10) {
			console.error('too many things');
		}

		const thing = getThing(msg);
		addThing(gameMap, thing, position, stackPos);
	}

	return 0;
}

function getThing(msg: BufferReader) {
	let thing;
	const id = msg.getUInt16();

	if (id === 0) {
		console.log('invalid thing id');
	} else if (id === 97 || id === 98 || id === 99) {
		thing = getCreature(msg, id);
	} else if (id === 96) { // otclient only
		thing = getStaticText(msg, id);
	} else {
		thing = getItem(msg, id);
	}

	return thing;
}

function getOutfit(msg: BufferReader) {
	const outfit: unk = {
		lookType: msg.getUInt16()
	};

	if (outfit.lookType !== 0) {
		outfit.head = msg.getByte();
		outfit.body = msg.getByte();
		outfit.legs = msg.getByte();
		outfit.feet = msg.getByte();
		outfit.addons = msg.getByte();
	} else {
		outfit.lookTypeEx = msg.getUInt16();
	}

	return outfit;
}

function getCreature(msg: BufferReader, type: number) {
	let creatureType;
	let id;
//	console.log('getCreature', type);
	const creature: unk = {
		'internalType': 'creature'
	};

	if (type === 0) {
		type = msg.getUInt16();
	}

	const known = (type !== 97);

	if (type === 98 || type === 97) {
		if (known) {
			id = msg.getUInt32();
		} else {
			const removeId = msg.getUInt32();
			id = msg.getUInt32();

			if (id >= 0x10000000 && id < 0x40000000)
				creatureType = 0;
			else if (id >= 0x40000000 && id < 0x80000000)
				creatureType = 1;
			else
				creatureType = 2;

			creature.name = msg.getString();
		}

		creature.healthPercent = msg.getByte();
		creature.direction = msg.getByte();
		creature.outfit = getOutfit(msg);
		const light = {
			intensity: msg.getByte(),
			color: msg.getByte()
		};
		msg.getUInt16(); //speed
		msg.getByte(); //skull
		msg.getByte(); //shield

		// emblem is sent only when the creature is not known
		let emblem = -1;
		creatureType = -1;

		if (true && !known) {
			emblem = msg.getByte();
		}

		const unpass = msg.getByte();
	} else if (type === 99) {
		id = msg.getUInt32();
		creature.direction = msg.getByte();
	} else {
		console.error('invalid creature opcode');
	}

	return creature;
}

function getStaticText(msg: BufferReader, id: number) {
//		console.log('getStaticText', id);
	let text;

	const colorByte = msg.getByte();
//    std::string fontName = msg.getString();
//    std::string text = msg.getString();
	return text;
}

function getItem(msg: BufferReader, id = 0) {
	if (id === 0) {
		id = msg.getUInt16();
	}

	if (!itemMap[id]) {
		console.error('brakuje itemu w itemMap', id);
		return null;
	}

	if (itemMap[id].attributes) {
		if (itemMap[id].attributes[5] || itemMap[id].attributes[11]) {
			msg.getByte();
		}
	}

	itemMap[id].internalType = 'item';
	itemMap[id].id = id;

	return itemMap[id];
}

function addThing(gameMap: any, thing: any, position: any, stackPos: number) {
	if (!gameMap[position.z]) {
		gameMap[position.z] = {};
	}

	const positionKey = position.y + '_' + position.x;

	if (!gameMap[position.z][positionKey]) {
		gameMap[position.z][positionKey] = [];
	}

	gameMap[position.z][positionKey][stackPos] = thing;
}

export {
	parseLogin,
	parseLoginWait,
	parseUpdateTile,
	parseTileAddThing,
	parseTileTransformThing,
	parseTileRemoveThing,
	parseCreatureMove,
	parseOpenContainer,
	parseCloseContainer,
	parseContainerAddItem,
	parseContainerUpdateItem,
	parseContainerRemoveItem,
	parseAddInventoryItem,
	parseRemoveInventoryItem,
	parseOpenNpcTrade,
	parseWorldLight,
	parseMagicEffect,
	parseAnimatedText,
	parseCreatureMark,
	parseCreatureHealth,
	parseCreatureLight,
	parseCreatureSpeed,
	parsePlayerStats,
	parsePlayerSkills,
	parsePlayerIcons,
	parseTalk,
	parseOpenChannel,
	parseTextMessage,
	getPosition,
	setMapDescription,
	parseVipAdd,
}
