<template>
  <div id="app">
    <energyMeasureBaseInfo/>
  </div>
</template>

<script>
import energyMeasureBaseInfo from './pages/energyMeasureBaseInfo/index'

export default {
  name: 'App',
  components: {
    energyMeasureBaseInfo
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
