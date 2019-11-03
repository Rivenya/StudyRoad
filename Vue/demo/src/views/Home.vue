<template>
  <div class="home">
    <p>这是主页</p>
  </div>
</template>

<script>
export default {
  name: 'home',
  beforeRouteEnter (to, from, next) {
    console.log("this is a beforeRouteEnter")
    next()
  },
  beforeRouteLeave (to, from, next) {
    alert("确定要离开？")
    next()
  }
}
</script>
