<template>
  <div
      class="ui button"
      :id="element.id"
      @click="$emit('buttonClick')"
      :style="{
        width: element.width + 'px',
        height: element.height + 'px',
        left: element.x + 'px',
        top: element.y + 'px',
        backgroundPositionX: -element.posx + 'px',
        backgroundPositionY: -element.posy + 'px'
      }"
  />
  <TextView v-bind:caption="element.caption" font="4" v-bind:x="element.x + element.offset" v-bind:y="element.y + 6"/>
</template>

<script>
import data from "@/shared/data.json";
import TextView from "@/components/element/TextView";

export default {
  name: 'ButtonView',
  components: {TextView},
  props: ['id', 'skin', 'x', 'y', 'caption', 'offset'],
  emits: ['buttonClick'],
  data() {
    const element = data.elements[this.skin ? this.skin : 10];

    return {
      element: {
        id: this.id,
        width: element.width,
        height: element.height,
        x: Number.parseInt(this.x),
        y: Number.parseInt(this.y),
        posx: element['posx'],
        posy: element['posy'],
        caption: this.caption ? this.caption : 'null',
        offset: this.offset ? Number.parseInt(this.offset) : 5
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
