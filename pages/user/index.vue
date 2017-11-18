<template lang='pug'>
  .container
    .user
      .user-header
        .nickname {{ user.nickname }}
        img(:src='user.avatar')
      .user-address
        cell(title='收货地址')
        .user-content {{ user.address }}
      .user-phone
        cell(title='电话')
        .user-content {{ user.phoneNumber }}
      .user-name
        cell(title='姓名')
        .user-content {{ user.name }}
      .user-order
        cell(title='我的订单')
        .user-order-item(v-for='(item, index) in user.orders' :key='index')
          img(:src='item.images')
          .user-order-intro
            .title {{ item.title }}
            .content {{ item.intro }}
          .user-order-price
            span ¥{{ item.price }}
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Cell from '~components/cell'
export default {
  head () {
    return {
      title: '用户主页'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.getUserData()
  },
  methods: {
    getUserData() {
      this.getUserData()
    },
    ...mapActions([
      'getUserData'
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
    +border-box
    padding-bottom: $navHeight
    .user
      +border-box
      padding: $spacing*2
      +font-dpr(10px)
      .user-header
        position: relative
        padding: $spacing*2 0
        font-size: 2.5em
        text-align: right
        .nickname
          float: left
          position: absolute 
          top: 50%
          transform: translateY(-50%)
        img
          width: 1.5rem
          height: 1.5rem
          display: inline-block
          border-radius: 50%
      .user-address, .user-phone, .user-name, .user-order
        padding: $spacing/2 0
        border-top: 1px solid $grey-400
        .user-content
          font-size: 1.8em
      .user-order
        
        .user-order-item
          width: 100%
          margin-top: $spacing/2
          font-size: 0
          > *
            display: inline-block
            height: 100%
            vertical-align: top
            +font-dpr(10px)
          img
            width: 25%
          .user-order-intro
            width: 50%
            margin-left: 5%
            border-bottom: 1px solid $grey-300
            overflow: hidden
            color: $grey-700
            .title
              padding-top: 3px
              font-size: 1.4em
              margin-bottom: .3em
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
            .content
              font-size: 1.25em
          .user-order-price
            width: 20%
            border-bottom: 1px solid $grey-300
            text-align: center
            color: $white
            span
              display: inline-block
              width: 100%
              margin-top: 5px
              padding: 3px 0
              background: $grey-800
</style>
