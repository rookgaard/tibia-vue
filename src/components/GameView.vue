<template>
  <div>game</div>
</template>

<script>
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
      console.log(data);
    }
  }
}
</script>
