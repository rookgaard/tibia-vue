<template>
  <canvas id="canvas" width="640" height="512"></canvas>
</template>

<script>
import gameMap from '@/shared/mapMock.json'

const lastPos = {
  x: 31965,
  y: 32116,
  z: 7
};
let imagesMap = [];
const fabric = window.fabric;
let canvas;

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function drawSword() {
  const sword = new Image(32, 32);
  sword.src = 'http://client.rookgaard.pl/860/opt/3.png';
  // console.log(sword);
  const swordInstance = new fabric.Image(sword, {
    left: randomIntFromInterval(0, 600),
    top: randomIntFromInterval(0, 400)
  });
  canvas.add(swordInstance);
  // console.log(swordInstance);
}

function drawSprite(spriteId, left, top) {
  // console.log(spriteId, left, top);

  if (!imagesMap[spriteId]) {
    const image = new Image(32, 32);
    image.src = 'http://client.rookgaard.pl/860/opt/' + spriteId + '.png';
    imagesMap[spriteId] = image;
  }

  const imageInstance = new fabric.Image(imagesMap[spriteId], {
    left: left,
    top: top
  });
  canvas.add(imageInstance);
}

function drawMap() {
  // console.log(gameMap[lastPos.z]);
  let spriteId;
  // drawSword();

  for (const positionKey in gameMap[lastPos.z]) {
    const position = positionKey.split('_');
    const offset = [(position[1] - lastPos.x + 8) * 32, (position[0] - lastPos.y + 5) * 32];
    // console.log(positionKey, position, offset, gameMap[lastPos.z][positionKey]);
    spriteId = gameMap[lastPos.z][positionKey][0].sprites[0];
    drawSprite(spriteId, offset[0], offset[1]);
    // drawSword();
  }

  for (const positionKey in gameMap[lastPos.z]) {
    const position = positionKey.split('_');
    const offset = [(position[1] - lastPos.x + 8) * 32, (position[0] - lastPos.y + 5) * 32];

    for (let stackPos = 1; stackPos < gameMap[lastPos.z][positionKey].length; stackPos++) {
      if (gameMap[lastPos.z][positionKey][stackPos] && gameMap[lastPos.z][positionKey][stackPos].internalType === 'item') {
        spriteId = gameMap[lastPos.z][positionKey][stackPos].sprites[0];
        drawSprite(spriteId, offset[0], offset[1]);
        // drawSword();
      }
    }
  }

  canvas.renderAll();
}

export default {
  name: 'TestComponent',
  sockets: {
    connect() {
      // console.log(this.$socket.id, 'socket connected');
    },
    test: function (data) {
      console.log(data)
    },
    message: function (data) {
      console.log(data)
    },
    error: function (data) {
      console.log(data);
    },
    characters: function (data) {
      console.log(data);
    },
    logged: function (mode) {
      console.log(mode);
    }
  },
  mounted: function () {
    let testMessage = {
      text: 'test',
    }
    // this.$socket.emit('test', testMessage);
    canvas = new fabric.Canvas('canvas', {
      backgroundColor: 'rgb(100,100,200)'
    });
    canvas.renderAll();
    drawMap();
    // drawSword();
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'TibiaClient';
  src: url('@/assets/tibia-client.ttf') format('truetype');
}
</style>
