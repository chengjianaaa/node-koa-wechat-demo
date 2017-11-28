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