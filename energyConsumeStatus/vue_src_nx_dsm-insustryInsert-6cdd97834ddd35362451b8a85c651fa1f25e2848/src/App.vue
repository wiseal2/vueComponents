<template>
  <div id="app">
    <energyConsumeStatus/>
  </div>
</template>

<script>
import energyConsumeStatus from './pages/energyConsumeStatus/index'

export default {
  name: 'App',
  components: {
    energyConsumeStatus
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
