<template>
  <section class="container">
    <span>测试微信网页授权</span>
    <h1 class="title">
      TESTOAUTH This page is loaded from the {{ name }}
    </h1>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `About Page (${this.name}-side)`
    }
  },
  beforeMount () {
    const currentUrl = window.location.href
    console.log(currentUrl)
    this.$store.dispatch('getUserByOAuth', encodeURIComponent(currentUrl)).then( res => {
      // console.log(res)
      if (res.data.success) {
        console.log(res.data)
        // 拿到params
        const params = res.data.params
        // 组装 需要验证的参数 

      }
    })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
