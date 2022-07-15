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
        backgroundPositionY: -element.posy + 'px',
        backgroundImage: 'url(\'' + require('@/assets/font' + element.font + '.png') + '\')'
      }"
  >
  </div>
</template>

<script>
import data from '@/shared/data.json';

export default {
  name: 'TextView',
  props: ['caption', 'font', 'x', 'y'],
  data() {
    let elements = [];
    let offset = Number.parseInt(this.x);
    let font = Number.parseInt(this.font);

    if (data.fontSize[font] === undefined) {
      font = 1;
    }

    for (let i = 0; i < this.caption.length; i++) {
      let symbol = this.caption.charAt(i);

      if (data.fontSymbols[symbol] === undefined) {
        symbol = 'A';
      }

      const fontSize = data.fontSize[font];
      const symbolInfo = data.fontSymbols[symbol];

      elements.push({
        font: font,
        width: symbolInfo[2][font - 1],
        height: fontSize[1],
        x: offset,
        y: Number.parseInt(this.y),
        posx: symbolInfo[0] * fontSize[0],
        posy: symbolInfo[1] * fontSize[1]
      });

      offset += symbolInfo[2][font - 1] + (font === 4 ? 0 : 1);
    }

    return {
      elements: elements
    };
  }
}
</script>

<style scoped>
.ui {
  background-image: url('@/assets/ui.png');
  position: absolute;
}
</style>
