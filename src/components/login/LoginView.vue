<template>
  <div id="client">
    <div id="button-area">
      <ElementView internalId="9" x="2" y="2" override-width="113" override-height="167"/>
      <ElementView internalId="1" x="0" y="0"/>
      <ElementView internalId="2" x="112" y="0"/>
      <ElementView internalId="3" x="0" y="166"/>
      <ElementView internalId="4" x="113" y="166"/>
      <ElementView internalId="5" x="0" y="5" override-height="161"/>
      <ElementView internalId="6" x="115" y="5" override-height="161"/>
      <ElementView internalId="7" x="5" y="0" override-width="107"/>
      <ElementView internalId="8" x="5" y="169" override-width="108"/>
    </div>
  </div>
</template>

<script>
import ElementView from "@/components/element/ElementView";

export default {
  name: "LoginView",
  components: {ElementView}
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
.ui {
  background-image: url('@/assets/ui.png');
  position: absolute;
}
</style>
