import {BufferReader} from '@/shared/bufferReader';
import LZString from 'lz-string';
import '@/shared/dat';
import {GameMap} from '@/shared/gameMap';
import {Position} from '@/shared/position';
import {Thing} from '@/shared/thing';

let itemMap: any;

function loadItemMap() {
	try {
		itemMap = JSON.parse(LZString.decompress(localStorage.getItem('datFile') ?? '') ?? '');
	} catch (e) {
		setTimeout(loadItemMap, 100);
	}
}

loadItemMap();

type unk = {
	[key: string]: any;
};

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
	console.log(message, time);
}

//105
function parseUpdateTile(msg: BufferReader, gameMap: GameMap) {
	const tilePos = getPosition(msg);
	setTileDescription(msg, gameMap, tilePos);
}

//106
function parseTileAddThing(msg: BufferReader, gameMap: GameMap) {
	const pos = getPosition(msg);
	const stackPos = msg.getByte();
	const thing = getThing(msg, gameMap);
	gameMap.addThing(thing, pos, stackPos);
}

//107
function parseTileTransformThing(msg: BufferReader, gameMap: GameMap) {
	const thing = getMappedThing(msg, gameMap);
	const newThing = getThing(msg, gameMap);

	if (!thing) {
		return console.log('no thing');
	}

	const pos = thing.position;
	const stackPos = thing.stackPos;
	gameMap.removeThing(pos, stackPos);
	gameMap.addThing(newThing, pos, stackPos);
}

//108
function parseTileRemoveThing(msg: BufferReader, gameMap: GameMap) {
	const thing = getMappedThing(msg, gameMap);

	if (!thing) {
		return console.log('no thing');
	}

	const pos = thing.position;
	const stackPos = thing.stackPos;
	gameMap.removeThing(pos, stackPos);
}

//109
function parseCreatureMove(msg: BufferReader, gameMap: GameMap) {
	const thing = getMappedThing(msg, gameMap);
	const newPos = getPosition(msg);

	if (!thing) {
		return console.log('no creature found to move');
	}

	const pos = thing.position;
	const stackPos = thing.stackPos;
	gameMap.removeThing(pos, stackPos);
	thing.data.direction = pos.getDirectionFromPositions(newPos, true);
	gameMap.addThing(thing, newPos, -1);
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
	return msg.getByte(); //containerId
}

//112
function parseContainerAddItem(msg: BufferReader) {
	return {
		containerId: msg.getByte(),
		item: getItem(msg)
	};
}

//113
function parseContainerUpdateItem(msg: BufferReader) {
	return {
		containerId: msg.getByte(),
		slot: msg.getByte(),
		item: getItem(msg)
	};
}

//114
function parseContainerRemoveItem(msg: BufferReader) {
	return {
		containerId: msg.getByte(),
		slot: msg.getByte()
	};
}

//120
function parseAddInventoryItem(msg: BufferReader) {
	return {
		slot: msg.getByte(),
		item: getItem(msg)
	};
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
	return {
		position: getPosition(msg),
		effect: msg.getByte()
	};
}

//132
function parseAnimatedText(msg: BufferReader) {
	return {
		position: getPosition(msg),
		color: msg.getByte(),
		text: msg.getString()
	};
}

//134
function parseCreatureMark(msg: BufferReader) {
	return {
		id: msg.getUInt32(),
		color: msg.getByte()
	};
}

//140
function parseCreatureHealth(msg: BufferReader) {
	return {
		id: msg.getUInt32(),
		healthPercent: msg.getByte()
	};
}

//141
function parseCreatureLight(msg: BufferReader) {
	return {
		id: msg.getUInt32(),
		light: {
			intensity: msg.getByte(),
			color: msg.getByte()
		}
	};
}

//143
function parseCreatureSpeed(msg: BufferReader) {
	return {
		id: msg.getUInt32(),
		speed: msg.getUInt16()
	};
}

//160
function parsePlayerStats(msg: BufferReader) {
	return {
		health: msg.getUInt16(),
		maxHealth: msg.getUInt16(),
		capacity: msg.getUInt32(),
		experience: msg.getUInt32(),
		level: msg.getUInt16(),
		levelPercent: msg.getByte(),
		mana: msg.getUInt16(),
		maxMana: msg.getUInt16(),
		magicLevel: msg.getByte(),
		magicLevelPercent: msg.getByte(),
		soul: msg.getByte(),
		stamina: msg.getUInt16()
	};
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
	return msg.getUInt16(); // icons
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
	console.log(`mode: ${mode}`);
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

function setMapDescription(msg: BufferReader, gameMap: GameMap, x: number, y: number, z: number, width: number, height: number) {
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

function setFloorDescription(msg: BufferReader, gameMap: GameMap, x: number, y: number, z: number, width: number, height: number, offset: number, skip: number) {
	for (let nx = 0; nx < width; nx++) {
		for (let ny = 0; ny < height; ny++) {
			const tilePos = new Position(x + nx + offset, y + ny + offset, z);

			if (skip === 0) {
				skip = setTileDescription(msg, gameMap, tilePos);
			} else {
				gameMap.removeTile(tilePos);
				skip--;
			}
		}
	}

	return skip;
}

function setTileDescription(msg: BufferReader, gameMap: GameMap, position: Position) {
	gameMap.removeTile(position);

	for (let stackPos = 0; stackPos < 256; stackPos++) {
		const peek = msg.peekUInt16();

		if (peek >= 0xff00) {
			return msg.getUInt16() & 0xff;
		}

		if (stackPos > 10) {
			console.error('too many things on a tile');
		}

		const thing = getThing(msg, gameMap);
		gameMap.addThing(thing, position, stackPos);
	}

	return 0;
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

function getThing(msg: BufferReader, gameMap: GameMap): Thing {
	const id = msg.getUInt16();

	if (id === 0) {
		throw new Error('invalid thing id');
	} else if (id === 97 || id === 98 || id === 99) {
		return getCreature(msg, gameMap, id);
	} else if (id === 96) { // otclient only
		return getStaticText(msg, id);
	} else {
		return getItem(msg, id);
	}
}

function getMappedThing(msg: BufferReader, gameMap: GameMap): Thing | null {
	const x = msg.getUInt16();

	if (x !== 0xffff) {
		const position = new Position(x, msg.getUInt16(), msg.getByte());
		const stackPos = msg.getByte();
		return gameMap.getThing(position, stackPos);
	} else {
		return gameMap.getCreatureById(msg.getUInt32());
	}
}

function getCreature(msg: BufferReader, gameMap: GameMap, type: number): Thing {
	let creature = new Thing();
	creature.type = 'creature';

	if (type === 0) {
		type = msg.getUInt16();
	}

	const known = (type !== 97);
	creature.data.known = known;

	if (type === 98 || type === 97) {
		if (known) {
			const id = msg.getUInt32();
			creature = gameMap.getCreatureById(id);
			creature.id = id;
		} else {
			creature.data.removeId = msg.getUInt32();
			creature.id = msg.getUInt32();

			if (creature.id >= 0x10000000 && creature.id < 0x40000000) {
				creature.data.creatureType = 0;
			} else if (creature.id >= 0x40000000 && creature.id < 0x80000000) {
				creature.data.creatureType = 1;
			} else {
				creature.data.creatureType = 2;
			}

			creature.data.name = msg.getString();
		}

		creature.data.healthPercent = msg.getByte();
		creature.data.direction = msg.getByte();
		creature.data.outfit = getOutfit(msg);
		creature.data.light = {
			intensity: msg.getByte(),
			color: msg.getByte()
		};
		creature.data.speed = msg.getUInt16();
		creature.data.skull = msg.getByte();
		creature.data.shield = msg.getByte();

		// emblem is sent only when the creature is not known
		creature.data.emblem = -1;

		if (!known) {
			creature.data.emblem = msg.getByte();
		}

		creature.data.unpass = msg.getByte();
	} else if (type === 99) {
		const id = msg.getUInt32();
		creature = gameMap.getCreatureById(id);
		creature.data.direction = msg.getByte();
	} else {
		console.error('invalid creature opcode');
	}

	return creature;
}

function getItem(msg: BufferReader, id = 0): Thing {
	if (id === 0) {
		id = msg.getUInt16();
	}

	if (!itemMap[id]) {
		console.error('brakuje itemu w itemMap', id);
	}

	if (itemMap[id].attributes) {
		if (itemMap[id].attributes[5] || itemMap[id].attributes[11]) {
			msg.getByte();
		}
	}

	const thing = new Thing();
	thing.id = id;
	thing.type = 'item';
	thing.data = itemMap[id];

	return thing;
}

function getStaticText(msg: BufferReader, id: number): Thing {
	const thing = new Thing();
	thing.id = id;
	thing.type = 'staticText';

	thing.data = {
		colorByte: msg.getByte(),
		fontName: msg.getString(),
		text: msg.getString()
	};

	return thing;
}

function getPosition(msg: BufferReader) {
	return new Position(msg.getUInt16(), msg.getUInt16(), msg.getByte());
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
