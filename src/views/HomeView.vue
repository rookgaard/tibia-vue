<template>
  <div class="home">
    <Main msg="Welcome to Your Vue.js + TypeScript Apps"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
// @ is an alias to /src
import Main from '@/components/Main.vue';

@Options({
  components: {
    Main,
  },
})
export default class HomeView extends Vue {
}
</script>
