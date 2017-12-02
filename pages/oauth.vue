<template lang='pug'>
  
</template>
<script>
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}
import { mapActions, mapMutations } from 'vuex'
import * as types from '../store/mutations_type'
export default {
  head() {
    return {
      title: '用户同意授权后,跳转的url'
    }
  },
  async beforeMount () {
    // 获取当前url
    const url = window.location.href
    // 如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
    // 解析微信传过来的参数(code,state)
    // state 包含实际要跳转的url(visit) 和 用户id(可选)
    const { data } = await this.getUserByOAuth(url)
    console.log(data)
    console.log(url)
    if (data.success) {
      // 拿到用户信息,保存store里面
      await this.setAuthUser(data.data)
      // 跳转到之前的页面
      const paramsArr = getUrlParam('state').split('_')
      const visit = paramsArr.length === 1 ? `/${paramsArr[0]}` : `/${paramsArr[0]}?id=${paramsArr[1]}`
      console.log(visit)
      this.$router.replace(visit)
    } else {
      throw new Error('用户信息获取失败')
    }
  },
  methods: {
    ...mapActions([
      'getUserByOAuth'
    ]),
    ...mapMutations({
      setAuthUser: 'SET_AUTH_USER'
    })
  }
}
</script>