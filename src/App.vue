<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/login">Login</router-link>
    |
    <router-link to="/game">Game</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  text-align: center;
}
</style>
