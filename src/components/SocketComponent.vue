<template>
  <div>test</div>
</template>

<script>
export default {
  name: 'SocketComponent',
  sockets: {
    connect() {
      console.log(this.$socket.id, 'socket connected');
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
    this.$socket.emit('test', testMessage);
  }
}
</script>
