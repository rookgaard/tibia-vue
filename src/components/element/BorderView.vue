<template>
  <ElementView skin="23" v-bind:x="element.x" v-bind:y="element.y" v-bind:override-width="element.width"/>
  <ElementView skin="24" v-bind:x="element.x" v-bind:y="element.y + 1" override-width="1"
               v-bind:override-height="element.height - 1"/>
  <ElementView skin="21" v-bind:x="element.x + element.width - 1" v-bind:y="element.y + 1" override-width="1"
               v-bind:override-height="element.height - 1"/>
  <ElementView skin="22" v-bind:x="element.x + 1" v-bind:y="element.y + element.height - 1"
               v-bind:override-width="element.width - 2"/>
  <div
      :style="{
        position: 'absolute',
        left: element.x + 1 + 'px',
        top: element.y + 1 + 'px',
        width: element.width - 2 + 'px',
        height: element.height - 2 + 'px',
        backgroundColor: 'rgb(64, 64, 64)'
      }"></div>
</template>

<script>
import ElementView from "@/components/element/ElementView";

export default {
  name: "BorderView",
  components: {ElementView},
  props: ['x', 'y', 'width', 'height'],
  data() {
    return {
      element: {
        x: Number.parseInt(this.x),
        y: Number.parseInt(this.y),
        width: Number.parseInt(this.width),
        height: Number.parseInt(this.height)
      }
    };
  }
}
</script>

<style scoped>

</style>
