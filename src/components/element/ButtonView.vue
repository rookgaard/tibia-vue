<template>
  <div
      class="ui button"
      v-bind:id="element.id"
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
import data from "@/shared/data.json";

export default {
  name: 'ButtonView',
  props: ['id', 'skin', 'x', 'y'],
  data() {
    const element = data.elements[this.skin];

    return {
      element: {
        id: this.id,
        width: element.width,
        height: element.height,
        x: Number.parseInt(this.x),
        y: Number.parseInt(this.y),
        posx: element['posx'],
        posy: element['posy']
      }
    };
  }
}
</script>

<style scoped>
.ui {
  background-image: url('@/assets/ui.png');
  position: absolute;
}

.ui.button {
  line-height: 20px;
}

.ui.button:active {
  background-position-y: -158px !important;
}
</style>
