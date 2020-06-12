<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  
  }
}
</script>

<style lang="less">
*{
  padding: 0;
  margin: 0;
}
body{
    height: 100vh;
}
#app{
  width: 100%;
  height: 100%;
}
</style>
