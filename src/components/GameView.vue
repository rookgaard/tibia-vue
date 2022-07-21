<template>
  <div>game</div>
</template>

<script>
import {BufferReader} from '@/shared/bufferReader'
import data from '@/shared/data.json'
import {
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
} from '@/shared/protocolParse';

let buffer;
let lastPos;
let gameMap = [];

function parseBuffer(msg, length) {
  let opcode = -1;

  while (msg.getPosition() - 2 < length) {
    opcode = msg.getByte();
    console.log(`opcode: ${opcode} (0x${opcode.toString(16)}), pos: ${msg.getPosition() - 1} (0x${(msg.getPosition() - 1).toString(16)})`);

    if (opcode === 30) {
      //ping
    } else if (opcode === 10) {
      parseLogin(msg);
    } else if (opcode === 22) {
      parseLoginWait(msg);
    } else if (opcode >= 100 && opcode <= 104) {
      if (opcode === 100) {
        lastPos = getPosition(msg);
        console.log(lastPos);
        setMapDescription(msg, gameMap, lastPos.x - data.range.left, lastPos.y - data.range.top, lastPos.z, data.range.horizontal, data.range.vertical);
      } else if (opcode === 101) {
        setMapDescription(msg, gameMap, lastPos.x - data.range.left, lastPos.y - data.range.top, lastPos.z, data.range.horizontal, 1);
      } else if (opcode === 102) {
        setMapDescription(msg, gameMap, lastPos.x + data.range.right, lastPos.y - data.range.top, lastPos.z, 1, data.range.vertical);
      } else if (opcode === 103) {
        setMapDescription(msg, gameMap, lastPos.x - data.range.left, lastPos.y + data.range.bottom, lastPos.z, data.range.horizontal, 1);
      } else if (opcode === 104) {
        setMapDescription(msg, gameMap, lastPos.x - data.range.left, lastPos.y - data.range.top, lastPos.z, 1, data.range.vertical);
      }

      drawMap();
    } else if (opcode === 105) {
      parseUpdateTile(msg, gameMap);
    } else if (opcode === 106) {
      parseTileAddThing(msg);
    } else if (opcode === 107) {
      parseTileTransformThing(msg);
    } else if (opcode === 108) {
      parseTileRemoveThing(msg);
    } else if (opcode === 109) {
      parseCreatureMove(msg);
    } else if (opcode === 110) {
      parseOpenContainer(msg);
    } else if (opcode === 111) {
      parseCloseContainer(msg);
    } else if (opcode === 112) {
      parseContainerAddItem(msg);
    } else if (opcode === 113) {
      parseContainerUpdateItem(msg);
    } else if (opcode === 114) {
      parseContainerRemoveItem(msg);
    } else if (opcode === 120) {
      parseAddInventoryItem(msg);
    } else if (opcode === 121) {
      parseRemoveInventoryItem(msg);
    } else if (opcode === 122) {
      parseOpenNpcTrade(msg);
    } else if (opcode === 130) {
      parseWorldLight(msg);
    } else if (opcode === 131) {
      parseMagicEffect(msg);
    } else if (opcode === 132) {
      parseAnimatedText(msg);
    } else if (opcode === 134) {
      parseCreatureMark(msg);
    } else if (opcode === 140) {
      parseCreatureHealth(msg);
    } else if (opcode === 141) {
      parseCreatureLight(msg);
    } else if (opcode === 160) {
      parsePlayerStats(msg);
    } else if (opcode === 161) {
      parsePlayerSkills(msg);
    } else if (opcode === 162) {
      parsePlayerIcons(msg);
    } else if (opcode === 170) {
      parseTalk(msg);
    } else if (opcode === 172) {
      parseOpenChannel(msg);
    } else if (opcode === 180) {
      parseTextMessage(msg);
    } else if (opcode === 210) {
      parseVipAdd(msg);
    } else {
      console.error('unknown opcode', opcode, '0x' + opcode.toString(16));
      break;
    }
  }
}

function drawMap() {
  console.log(gameMap);
  return 1;
}

export default {
  name: 'GameView',
  sockets: {
    connect() {
      console.log(this.$socket.id, 'socket connected');
    },
    error: function (data) {
      console.log(data);
    },
    message: function (data) {
      console.info('-------------------------------');
      buffer = data.buffer;
      const msg = new BufferReader(data.buffer);
      const msgLength = msg.getUInt16();
      console.log(msg, msgLength);
      parseBuffer(msg, msgLength);
    }
  },
  mounted: function () {
    console.log(Date());
    this.$socket.emit('login', process.env.VUE_APP_LOGIN, process.env.VUE_APP_PASSWORD, process.env.VUE_APP_NAME);
  }
}
</script>
