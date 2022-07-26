<template>
  <div id="stage">
    <canvas id="background-layer" width="640" height="512"></canvas>
    <canvas id="game-layer" width="640" height="512"></canvas>
    <canvas id="character-layer" width="640" height="512"></canvas>
    <canvas id="message-layer" width="640" height="512"></canvas>
  </div>
</template>

<script>
import {BufferReader} from '@/shared/bufferReader'
import data from '@/shared/data.json'
import {Canvas} from '@/shared/canvas'
import {GameMap} from '@/shared/gameMap';
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
let gameMap = new GameMap();
let background, game, characters, messages;
let imgMap = [];

function drawSprite(canvas, item, left, top) {
  const width = item.data.width * 32;
  left -= width - 32;
  const height = item.data.height * 32;
  top -= height - 32;

  if (imgMap[item.id]) {
    canvas.drawImage(imgMap[item.id], left, top, width, height);
  } else {
    const img = new Image();
    img.src = 'http://client.rookgaard.pl/860/opt/' + item.id + '.png';
    img.onload = () => {
      canvas.drawImage(img, left, top, width, height);
    }
    imgMap[item.id] = img;
  }
}

function drawCreature(canvas, creature, left, top) {
  const outfit = creature.data.outfit;
  let color;

  if (creature.data.healthPercent <= 3) {
    color = 'rgb(93, 0, 0)';
  } else if (creature.data.healthPercent <= 29) {
    color = 'rgb(188, 47, 47)';
  } else if (creature.data.healthPercent <= 59) {
    color = 'rgb(180, 180, 0)';
  } else if (creature.data.healthPercent <= 94) {
    color = 'rgb(96, 192, 96)';
  } else {
    color = 'rgb(0, 192, 0)';
  }

  const img = new Image();
  img.src = 'https://outfit-images.ots.me/idleOutfits1092/outfit.php?id=' + outfit.lookType + '&addons=' + outfit.addons + '&head=' + outfit.head + '&body=' + outfit.body + '&legs=' + outfit.legs + '&feet=' + outfit.feet + '&direction=' + (creature.data.direction + 1);
  img.onload = function () {
    canvas.drawImage(
        img,
        left - 32,
        top - 32,
        64,
        64
    );
  }
  messages.drawRect(left - 5, top - 10, 27, 4, 'black');
  const bar = Math.floor(creature.data.healthPercent / 4);
  messages.drawRect(left - 4, top - 9, bar, 2, color);
  const textWidth = canvas.getTextWidth(creature.data.name);
  messages.drawText(creature.data.name, left - (textWidth / 2) + 11, top - 11, color);
}

function drawMap() {
  // console.log('drawMap');
  background.clear();
  background.drawRect(0, 0, background.getWidth(), background.getHeight(), 'black');
  game.clear();
  characters.clear();
  messages.clear();
  const centralPos = gameMap.centralPosition;

  for (const z in gameMap.things) {
    for (const y in gameMap.things[z]) {
      for (const x in gameMap.things[z][y]) {
        for (const stackPos in gameMap.things[z][y][x]) {
          const thing = gameMap.things[z][y][x][stackPos];
          const offset = [(thing.position.x - centralPos.x + 8) * 32, (thing.position.y - centralPos.y + 5) * 32];
          // console.log(thing, offset);

          if (thing.type === 'item') {
            drawSprite(stackPos === 0 ? background : game, thing, offset[0], offset[1]);
          } else if (thing.type === 'creature') {
            drawCreature(characters, thing, offset[0], offset[1]);
          }
        }
      }
    }
  }
}

function parseBuffer(msg, length) {
  let opcode = -1;
  let updateMap = false;

  while (msg.getPosition() - 2 < length) {
    opcode = msg.getByte();
    const opcodeName = data.opcodes[opcode] ?? '';
    console.log(`opcode: ${opcode} (0x${opcode.toString(16)} ${opcodeName}), pos: ${msg.getPosition() - 1} (0x${(msg.getPosition() - 1).toString(16)})`);

    if (opcode === 30) {
      //ping
    } else if (opcode === 10) {
      parseLogin(msg);
    } else if (opcode === 22) {
      parseLoginWait(msg);
    } else if (opcode >= 100 && opcode <= 109) {
      if (opcode === 100) {
        const position = getPosition(msg);
        gameMap.centralPosition = position;
        setMapDescription(msg, gameMap, position.x - data.range.left, position.y - data.range.top, position.z, data.range.horizontal, data.range.vertical);
      } else if (opcode === 101) {
        const position = gameMap.centralPosition;
        --position.y;
        setMapDescription(msg, gameMap, position.x - data.range.left, position.y - data.range.top, position.z, data.range.horizontal, 1);
        gameMap.centralPosition = position;
      } else if (opcode === 102) {
        const position = gameMap.centralPosition;
        ++position.x;
        setMapDescription(msg, gameMap, position.x + data.range.right, position.y - data.range.top, position.z, 1, data.range.vertical);
        gameMap.centralPosition = position;
      } else if (opcode === 103) {
        const position = gameMap.centralPosition;
        ++position.y;
        setMapDescription(msg, gameMap, position.x - data.range.left, position.y + data.range.bottom, position.z, data.range.horizontal, 1);
        gameMap.centralPosition = position;
      } else if (opcode === 104) {
        const position = gameMap.centralPosition;
        --position.x;
        setMapDescription(msg, gameMap, position.x - data.range.left, position.y - data.range.top, position.z, 1, data.range.vertical);
        gameMap.centralPosition = position;
      } else if (opcode === 105) {
        parseUpdateTile(msg, gameMap);
      } else if (opcode === 106) {
        parseTileAddThing(msg, gameMap);
      } else if (opcode === 107) {
        parseTileTransformThing(msg, gameMap);
      } else if (opcode === 108) {
        parseTileRemoveThing(msg, gameMap);
      } else if (opcode === 109) {
        parseCreatureMove(msg, gameMap);
      }

      updateMap = true;
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
      const data = parseMagicEffect(msg);
      // console.log(data);
    } else if (opcode === 132) {
      const data = parseAnimatedText(msg);
      // console.log(data);
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

  if (updateMap) {
    drawMap();
  }
}

export default {
  name: 'GameView',
  sockets: {
    connect() {
      // console.log(this.$socket.id, 'socket connected');
    },
    error: function (data) {
      console.log(data);
    },
    message: function (data) {
      buffer = data.buffer;
      const msg = new BufferReader(data.buffer);
      const msgLength = msg.getUInt16();

      if (msgLength > data.buffer.byteLength + 256) {
        return;
      }

      console.info('-------------------------------');
      console.log(msg, msgLength, data.buffer.byteLength);
      parseBuffer(msg, msgLength);
    }
  },
  mounted: async function () {
    this.$socket.emit('login', process.env.VUE_APP_LOGIN, process.env.VUE_APP_PASSWORD, process.env.VUE_APP_NAME);
    background = new Canvas('background-layer');
    game = new Canvas('game-layer');
    characters = new Canvas('character-layer');
    messages = new Canvas('message-layer');

    await this.loadFont();
  },
  methods: {
    loadFont: async () => {
      const myFont = new FontFace('TibiaFilled', 'url(\'' + require('@/assets/tibiafilled.ttf') + '\')');
      const font = await myFont.load();
      document.fonts.add(font);
    }
  }
}
</script>

<style scoped>
#stage {
  width: 640px;
  height: 512px;
  position: relative;
  border: 2px solid black;
  margin: auto;
}

canvas {
  position: absolute;
  left: 0;
  top: 0;
}

#message-layer {
  z-index: 4;
}

#character-layer {
  z-index: 3;
}

#game-layer {
  z-index: 2;
}

#background-layer {
  z-index: 1;
}
</style>
