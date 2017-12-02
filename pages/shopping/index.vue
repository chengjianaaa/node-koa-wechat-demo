<template lang='pug'>
  .container
    .shopping-header 权游周边
    .shopping-content
      .shopping-item(v-for='(item, index) in products' :key='index' @click='_goToDetailProductPage(item._id)')
        img(:src="imageCdnPrefix + item.images[0]")
        .desc
          .title {{item.title}}
          .introducion {{item.intro}}
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  middleware: 'wechat-auth', // 微信授权中间件
  head () {
    return {
      title: '周边手办'
    }
  },
  computed: {
    ...mapGetters([
      'products',
      'imageCdnPrefix'
    ])
  },
  created() {
    this._getProductsData()
  },
  methods: {
    _getProductsData() {
      this.getProductsData()
    },
    _goToDetailProductPage(productId) {
      this.$router.push({
        path: '/deal',
        query: { id: productId }
      })
    },
    ...mapActions([
      'getProductsData'
    ])
  }
}
</script>
<style scoped lang='sass'>
  @import '~static/sass/mixin'
  @import '~static/sass/color'
  @import '~static/sass/var'
  .container
    +border-box
    padding-bottom: $navHeight
    background-color: $grey-200
    > *
      width: 100%
      background-color: $white
    .shopping-header
      +font-dpr(18px)
      text-align: center
      margin-bottom: $spacing
      padding: $spacing/2 0
    .shopping-content
      +border-box
      padding-bottom: $spacing*3
      .shopping-item
        overflow: hidden
        border-bottom: 2px solid $grey-200
        img
          width: 40%
        .desc
          width: 60%
          height: 100%
          float: right
          +display-flex
          +flex-column
          -webkit-box-pack: center
          -ms-flex-pack: center
          justify-content: center
          +border-box
          padding: $spacing/2 $spacing 0
          +font-dpr(10px)
          .title 
            font-size: 1.8em
            line-height: 1.7em
            +text-overflow
          .introducion
            font-size: 1.3em
            line-height: 1.3em
            color: $grey-600
</style>