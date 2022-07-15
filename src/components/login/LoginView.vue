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
      <ButtonView id="enter-game" skin="10" x="16" y="16" caption="Enter Game" offset="19"/>
      <ButtonView id="access-account" skin="10" x="16" y="46" caption="Access Account" offset="19"/>
      <ButtonView id="options" skin="10" x="16" y="76" caption="Options" offset="19"/>
      <ButtonView id="info" skin="10" x="16" y="106" caption="Info" offset="19"/>
      <ButtonView id="exit-game" skin="10" x="16" y="136" caption="Exit Game" offset="19"/>
    </div>
    <form id="login-form">
      <WindowView width="236" height="178"/>
      <TextView caption="Enter Game" font="1" x="85" y="5"/>
      <TextView caption="Account Name" font="1" x="18" y="36"/>
      <input class="tibia tal"
             style="position: absolute;left: 132px;top: 32px;width: 86px;height: 16px;line-height: 14px;"
             type="password" name="login"/>
      <TextView caption="Password" font="1" x="18" y="65"/>
      <input class="tibia tal"
             style="position: absolute;left: 132px;top: 61px;width: 86px;height: 16px;line-height: 14px;"
             type="password" name="password"/>
      <TextView caption="Character" font="1" x="18" y="90"/>
      <input class="tibia tal"
             style="position: absolute;left: 132px;top: 86px;width: 86px;height: 16px;line-height: 14px;" type="text"
             name="name"/>
      <ButtonView id="login" skin="20" x="127" y="148" caption="Ok" offset="15"/>
      <ButtonView id="restart" skin="20" x="177" y="148" caption="Restart" offset="5"/>
    </form>
    <div id="character-window">
      <WindowView width="236" height="294"/>
      <TextView caption="Select Character" font="1" x="70" y="5"/>
      <TextView caption="Select Character:" font="1" x="18" y="34"/>
      <BorderView x="18" y="47" width="200" height="146"/>
      <div id="characters"></div>
    </div>
  </div>
</template>

<script>
import ElementView from "@/components/element/ElementView";
import ButtonView from "@/components/element/ButtonView";
import TextView from "@/components/element/TextView";
import WindowView from "@/components/element/WindowView";
import BorderView from "@/components/element/BorderView";

export default {
  name: "LoginView",
  components: {BorderView, WindowView, TextView, ButtonView, ElementView}
}
</script>

<style scoped>
#client {
  width: 640px;
  height: 480px;
  background-image: url('@/assets/bg.png');
  position: relative;
}

#button-area {
  width: 117px;
  height: 171px;
  left: 60px;
  bottom: 69px;
  position: absolute;
}

#login-form {
  width: 236px;
  height: 178px;
  position: absolute;
  left: 202px;
  top: 151px;
}

#character-window {
  width: 236px;
  height: 294px;
  position: absolute;
  left: 202px;
  top: 93px;
}

#characters {
  position: absolute;
  left: 19px;
  top: 48px;
}

.tibia {
  font-family: 'TibiaClient';
  /*-webkit-text-stroke: 0px black;*/
  color: white;
  font-size: 8px;
}

.tal {
  text-align: left;
}

input[type=password],
input[type=text] {
  background-color: rgb(54, 54, 54);
  height: 16px;
  border-image-slice: 1 fill;
  border-image-width: 1px;
  border-image-outset: 1px;
  border-image-source: url('@/assets/input-border.png');
  padding: 0;
  border-width: 0;
}

@font-face {
  font-family: 'TibiaClient';
  src: url('@/assets/tibia-client.ttf') format('truetype');
}
</style>
