<template>
  <!-- 路由占位符 -->
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      hello: false,
    }
  },
  created() {
    document.title = "OTA系统";
  }
}
</script>

<style lang="less">
html,
body {
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  background: url("./assets/bg.jpg") no-repeat;
  background-size: cover;
  background-position: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
}

.page {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>

