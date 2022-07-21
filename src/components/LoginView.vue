<template>
  <div id="client">
    <div id="button-area">
      <ElementView skin="9" x="2" y="2" override-width="113" override-height="167"/>
      <ElementView skin="1" x="0" y="0"/>
      <ElementView skin="2" x="112" y="0"/>
      <ElementView skin="3" x="0" y="166"/>
      <ElementView skin="4" x="113" y="166"/>
      <ElementView skin="5" x="0" y="5" override-height="161"/>
      <ElementView skin="6" x="115" y="5" override-height="161"/>
      <ElementView skin="7" x="5" y="0" override-width="107"/>
      <ElementView skin="8" x="5" y="169" override-width="108"/>
      <ButtonView @buttonClick="enter" id="enter-game" skin="10" x="16" y="16" caption="Enter Game" offset="19"/>
      <ButtonView id="access-account" skin="10" x="16" y="46" caption="Access Account" offset="19"/>
      <ButtonView id="options" skin="10" x="16" y="76" caption="Options" offset="19"/>
      <ButtonView id="info" skin="10" x="16" y="106" caption="Info" offset="19"/>
      <ButtonView id="exit-game" skin="10" x="16" y="136" caption="Exit Game" offset="19"/>
    </div>
    <form v-if="loginShow" id="login-form">
      <WindowView width="236" height="178"/>
      <TextView caption="Enter Game" font="1" x="85" y="5"/>
      <TextView caption="Account Name" font="1" x="18" y="36"/>
      <input class="tibia tal"
             style="position: absolute;left: 132px;top: 32px;width: 86px;height: 16px;line-height: 14px;"
             type="password" name="login" v-model="inputLogin"/>
      <TextView caption="Password" font="1" x="18" y="65"/>
      <input class="tibia tal"
             style="position: absolute;left: 132px;top: 61px;width: 86px;height: 16px;line-height: 14px;"
             type="password" name="password" v-model="inputPassword"/>
      <TextView caption="Character" font="1" x="18" y="90"/>
      <input class="tibia tal"
             style="position: absolute;left: 132px;top: 86px;width: 86px;height: 16px;line-height: 14px;" type="text"
             name="name" v-model="inputName"/>
      <ButtonView @buttonClick="login" id="login" skin="20" x="127" y="148" caption="Ok" offset="15"/>
      <ButtonView @buttonClick="cancelLogin" id="restart" skin="20" x="177" y="148" caption="Cancel" offset="5"/>
    </form>
    <div v-if="charactersShow" id="character-window">
      <WindowView width="236" height="294"/>
      <TextView caption="Select Character" font="1" x="70" y="5"/>
      <TextView caption="Select Character:" font="1" x="18" y="34"/>
      <BorderView x="18" y="47" width="200" height="146"/>
      <div id="characters">
        <div
            class="character-entry"
            :class="{ active: character.active }"
            v-for="character in characters"
            :data-name="character.name"
            :key="character.name"
            @click="selectCharacter(character)"
            @dblclick="loginCharacter(character)"
        >
          <TextView v-bind:caption="character.name" font="1" x="1" y="1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ElementView, ButtonView, TextView, WindowView, BorderView} from '@/components/element'
import router from '@/router';

export default {
  name: 'LoginView',
  components: {BorderView, WindowView, TextView, ButtonView, ElementView},
  data() {
    return {
      loginShow: false,
      charactersShow: false,
      characters: [],
    }
  },
  sockets: {
    characters: function (data) {
      this.loginShow = false;
      this.charactersShow = true;
      this.characters = data;
      this.characters.forEach((character) => {
        character.active = false;
      })
    }
  },
  methods: {
    enter() {
      this.loginShow = true;
    },
    cancelLogin() {
      this.loginShow = false;
    },
    login() {
      this.$socket.emit('login', this.inputLogin, this.inputPassword, '');
    },
    selectCharacter(character) {
      this.characters.forEach((character) => {
        character.active = false;
      })
      character.active = true;
    },
    loginCharacter(character) {
      this.$socket.emit('login', this.inputLogin, this.inputPassword, character.name);
      router.push('game');
    }
  }
}
</script>

<style scoped src="@/assets/login.css"/>
