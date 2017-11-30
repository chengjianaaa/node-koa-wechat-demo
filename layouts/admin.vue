<template lang='pug'>
  #app
    v-header
    #container
      v-aside
      nuxt
</template>
<script>
import vHeader from '~components/header'
import vAside from '~components/aside'
export default {
  middleware: 'auth', // 鉴定是否登录的中间件
  components:{
    vHeader,
    vAside
  }
}
</script>
<style scoped lang='sass'>
  #container 
    display: flex
</style>