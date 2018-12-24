<template>
  <div id="app">
    <areaEnergyConsumeStatus/>
  </div>
</template>

<script>
import areaEnergyConsumeStatus from './pages/areaEnergyConsumeStatus/index'

export default {
  name: 'App',
  components: {
    areaEnergyConsumeStatus
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
