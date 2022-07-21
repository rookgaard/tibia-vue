<template>
  <ElementView skin="11" x="0" y="0"/> <!-- top-left -->
  <ElementView skin="12" v-bind:x="element.width - 4" y="0"/> <!-- top-right -->
  <ElementView skin="13" x="0" v-bind:y="element.height - 4"/> <!-- bottom-left -->
  <ElementView skin="14" v-bind:x="element.width - 4" v-bind:y="element.height - 4"/> <!-- bottom-right -->
  <ElementView skin="15" x="4" y="0" v-bind:override-width="element.width - 8"/> <!-- caption -->
  <ElementView skin="16" x="0" y="17" v-bind:override-height="element.height - 21"/> <!-- left -->
  <ElementView skin="17" x="232" y="17" v-bind:override-height="element.height - 21"/> <!-- right -->
  <ElementView skin="18" x="4" v-bind:y="element.height - 4" v-bind:override-width="element.width - 8"/> <!-- bottom -->
  <ElementView skin="19" x="4" y="17" v-bind:override-width="element.width - 8"
               v-bind:override-height="element.height - 21"/> <!-- background -->
</template>

<script>
import ElementView from '@/components/element/ElementView';

export default {
  name: 'WindowView',
  props: ['width', 'height'],
  data() {
    return {
      element: {
        width: Number.parseInt(this.width),
        height: Number.parseInt(this.height)
      }
    }
  },
  components: {ElementView}
}
</script>
