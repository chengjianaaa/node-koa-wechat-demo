<template>
  <section class="container">
    <span>测试微信JS-SDK获取权限</span>
    <h1 class="title">
      This page is loaded from the {{ name }}
    </h1>
    <h2 class="info" v-if="name === 'client'">
      Please refresh the page
    </h2>
    <nuxt-link class="button" to="/">
      Home page
    </nuxt-link>
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
    const wx = window.wx
    const currentUrl = window.location.href
    this.$store.dispatch('getWechatSignature', encodeURIComponent(currentUrl)).then( res => {
      console.log(res)
      if (res.data.success) {
        // 拿到params
        const params = res.data.params
        // 组装 需要验证的参数 
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: params.appId, // 必填，公众号的唯一标识
            timestamp: params.timestamp, // 必填，生成签名的时间戳
            nonceStr: params.nonceStr, // 必填，生成签名的随机串
            signature: params.signature,// 必填，签名，见附录1
            jsApiList: [
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'onMenuShareTimeLine',
              'hideAllNonBaseMenuItem',
              'showMenuItems'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(() => {
          wx.hideAllNonBaseMenuItem()
          console.log('success')
        });
        wx.error(() => {
          console.log('error')
        })
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
