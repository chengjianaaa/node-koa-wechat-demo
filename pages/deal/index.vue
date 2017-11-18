<template lang='pug'>
  .container
    .deal-body
      .deal-swiper(v-swiper='swiperConfig')
        .swiper-wrapper
          .swiper-slide(v-for='(item, index) in currentProduct.images')
            img(:src='item')
        .swiper-pagination.swiper-pagination-bullets
      .deal-content
        .price
          span.main {{ currentProduct.price.toFixed(2) - currentProduct.price.toFixed(2).substr(-3) }}
          span.others {{ currentProduct.price.toFixed(2).substr(-3) }}
        .name {{ currentProduct.title }}
        .intro {{ currentProduct.intro }}
        .info
          cell(v-for='(item, index) in currentProduct.parameters' :key='index' :title='item.key' :content='item.value')
        .attentions
          .title 购买提示
          ol
            li(v-for='(item, index) in attentions' :key='index') {{item}}
    .deal-footer
      span 购买
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Cell from '~components/cell'
export default {
  head () {
    return {
      title: '周边手办详情页面'
    }
  },
  data() {
    return {
      swiperConfig: {
        autoplay: 4000,
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination'
      },
      attentions: [
        '商品和服务差异',
        '物流配送'
      ],
    }
  },
  computed: {
    ...mapGetters([
      'currentProduct'
    ])
  },
  created() {
    const productId = this.$route.query.id // 拿到productId
    this._getProductDataById(productId)
  },
  methods: {
    _getProductDataById(productId) {
      this.getProductsData(productId)
    },
    ...mapActions([
      'getProductsData'
    ])
  },
  components: {
    Cell
  }
}
</script>
<style scoped lang='sass'>
  @import '~static/sass/mixin'
  @import '~static/sass/color'
  @import '~static/sass/var'
  .container
    overflow: hidden !important
    padding-bottom: 0 !important
    -webkit-overflow-scrolling: auto
    .deal-body
      height: calc(100% - #{$navHeight})
      // height: 100%
      +y-scroll
      .deal-swiper
        position: relative
        width: 100%
        // height: 10rem
        .swiper-wrapper
          .swiper-slide
            img
              width: 100%
              height: 100%
        .swiper-pagination.swiper-pagination-bullets
      
      .deal-content
        width: 100%
        padding: $spacing
        color: $grey-700
        +font-dpr(10px)
        +border-box
        .price
          &:before
            display: inline-block
            content: '¥'
            font-size: 2em
            padding-top: 1px
            vertical-align: top
          .main
            font-size: 2em
            margin: 0 3px
          .others
            font-size: 1.3em
            vertical-align: text-bottom
        .name
          font-size: 2em
          color: $grey-900
        .intro
          font-size: 1.5em
          line-height: 1.5em
          margin: $spacing 0
        .info
          background: #bde6e2
          padding: $spacing

          >*
            padding: $spacing/2 0
            color: $grey-700
            // transform: scale(0.85)
          >*:not(:last-child)
            border-bottom: 1px solid $white
        .attentions
          margin: $spacing 0
          .title
            font-size: 1.9em
          ol
            padding: 0
            font-size: 1.3em
            list-style-type: decimal // 显示数字下标
            li
              list-style-position: inside // 左边对齐
              margin: 1em 0
    .deal-footer
      +border-box
      height: $navHeight
      border-top: 1px solid $grey-300
      text-align: center
      line-height: $navHeight
      span
        +font-dpr(16px)
        padding: $navHeight/10 12%
        color: $white
        background: $grey-600
        border-radius: 3px
</style>