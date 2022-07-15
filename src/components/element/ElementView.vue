<template>
  <div
      v-for="element in elements"
      class="ui"
      :key="element.width"
      :style="{
        width: element.width + 'px',
        height: element.height + 'px',
        left: element.x + 'px',
        top: element.y + 'px',
        backgroundPositionX: -element.posx + 'px',
        backgroundPositionY: -element.posy + 'px'
      }"
  >
  </div>
</template>

<script>
import data from '@/shared/data.json';

export default {
  name: 'ElementView',
  props: ['internalId', 'overrideWidth', 'overrideHeight', 'left', 'top', 'x', 'y'],
  data() {
    const element = data.elements[this.internalId];
    const width = Number.parseInt(this.overrideWidth ? this.overrideWidth : element['width']);
    const height = Number.parseInt(this.overrideHeight ? this.overrideHeight : element['height']);
    console.warn(element, width, height);

    if (width <= element['width'] && height <= element['height']) {
      return {
        elements: [
          {width: width, height: height, x: Number.parseInt(this.x), y: Number.parseInt(this.y), posx: element['posx'], posy: element['posy']}
        ]
      }
    }

    let elements = [];

    if (width > element['width'] && height > element['height']) {
      let repeatX = Math.floor(width / element['width']);
      let offsetX = 0;
      let repeatY = Math.floor(height / element['height']);
      let offsetY = 0;

      for (; offsetX < repeatX; offsetX++) {
        offsetY = 0;
        for (; offsetY < repeatY; offsetY++) {
          elements.push({
            width: element['width'],
            height: element['height'],
            x: Number.parseInt(this.x) + (offsetX * element['width']),
            y: Number.parseInt(this.y) + (offsetY * element['height']),
            posx: element['posx'],
            posy: element['posy']
          })
        }

        const restY = (height - repeatY * element['height']) % element['height'];

        if (restY > 0) {
          elements.push({
            width: element['width'],
            height: restY,
            x: Number.parseInt(this.x) + (offsetX * element['width']),
            y: Number.parseInt(this.y) + (offsetY * element['height']),
            posx: element['posx'],
            posy: element['posy']
          })
        }
      }

      const restX = (width - repeatX * element['width']) % element['width'];

      if (restX > 0) {
        offsetY = 0;
        for (; offsetY < repeatY; offsetY++) {
          elements.push({
            width: restX,
            height: element['height'],
            x: Number.parseInt(this.x) + (offsetX * element['width']),
            y: Number.parseInt(this.y) + (offsetY * element['height']),
            posx: element['posx'],
            posy: element['posy']
          })
        }

        const restY = (height - repeatY * element['height']) % element['height'];

        if (restY > 0) {
          elements.push({
            width: restX,
            height: restY,
            x: Number.parseInt(this.x) + (offsetX * element['width']),
            y: Number.parseInt(this.y) + (offsetY * element['height']),
            posx: element['posx'],
            posy: element['posy']
          })
        }
      }
    } else if (height > element['height']) {
      const repeat = Math.floor(height / element['height']);
      let offset = 0;

      for (; offset < repeat; offset++) {
        elements.push({
          width: width,
          height: element['height'],
          x: Number.parseInt(this.x),
          y: Number.parseInt(this.y) + (offset * element['height']),
          posx: element['posx'],
          posy: element['posy']
        })
      }

      const rest = (height - repeat * element['height']) % element['height'];

      if (rest > 0) {
        elements.push({
          width: width,
          height: rest,
          x: Number.parseInt(this.x),
          y: Number.parseInt(this.y) + (offset * element['height']),
          posx: element['posx'],
          posy: element['posy']
        })
      }
    } else if (width > element['width']) {
      const repeat = Math.floor(width / element['width']);
      let offset = 0;

      for (; offset < repeat; offset++) {
        elements.push({
          width: element['width'],
          height: height,
          x: Number.parseInt(this.x) + (offset * element['width']),
          y: Number.parseInt(this.y),
          posx: element['posx'],
          posy: element['posy']
        })
      }

      const rest = (width - repeat * element['width']) % element['width'];

      if (rest > 0) {
        elements.push({
          width: rest,
          height: height,
          x: Number.parseInt(this.x) + (offset * element['width']),
          y: Number.parseInt(this.y),
          posx: element['posx'],
          posy: element['posy']
        })
      }
    }

    console.log(elements);

    return {
      elements: elements
    }
  }
}
</script>

<style scoped>
.ui {
  background-image: url('@/assets/ui.png');
  position: absolute;
}
</style>
