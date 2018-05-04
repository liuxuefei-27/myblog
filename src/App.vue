<template>
  <div id="app">
    <fire-canvas class="fire"></fire-canvas>
    <router-view/>
  </div>
</template>

<script>
import FireCanvas from './components/FireCanvas'
export default {
  name: 'App',
  components:{
    FireCanvas
  }
}
</script>

<style>
  #app {
    margin: 0;
    padding: 0;
    overflow: hidden;
    min-height: 100%;
    width: 100%;
  }
  @media screen and (max-width: 440px) {
    .fire {
      display: none;
    }
    #app {
      background: #000;
    }
  }
</style>
