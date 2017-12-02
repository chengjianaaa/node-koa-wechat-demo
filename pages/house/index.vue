<template lang='pug'>
  .container
    .house-banner
      img(v-if='currentHouse.cname' :src="imageCdnPrefix + currentHouse.cname + '.jpg?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim'")
      .desc
        .words {{ currentHouse.words }}
        .name {{ currentHouse.name }}
    .house-content
      .house-introduce
        .title {{currentHouse.cname}}
        .body {{currentHouse.intro}}
      .house-character
        .title 主要角色
        .character-item(v-for="(item, index) in currentHouse.swornMembers" :key='index')
          img(:src="imageCdnPrefix + item.character.profile + '?imageView2/1/w/280/h/440'")
          .desc
            .name {{item.character.cname}}
            .introducion {{item.text}}
      .house-section(v-for='(item, index) in currentHouse.sections' :key='index') 
        .title {{item.title}}
        .body(v-for='text in item.content') {{ text }}
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  middleware: 'wechat-auth', // 微信授权中间件
  head () {
    return {
      title: '家族详情'
    }
  },
  computed: {
    ...mapGetters([
      'currentHouse',
      'imageCdnPrefix'
    ])
  },
  created() {
    const houseId = this.$route.query.id
    this._getHousesDataById(houseId)
  },
  methods: {
    _getHousesDataById(houseId) {
      this.getHousesData(houseId)
    },
    ...mapActions([
      'getHousesData'
    ])
  }
}
</script>
<style scoped lang='sass'>
  @import '~static/sass/mixin'
  @import '~static/sass/color'
  @import '~static/sass/var'
  .container
    .house-banner
      position: relative
      font-size: 0
      img
        width: 100%
      .desc
        width: 100%
        +border-box
        padding: 0 $spacing
        text-align: left
        position: absolute
        bottom: 5%
        left: 0
        color: $white
        +font-dpr(10px)
        line-height: .7rem
        .words
          font-size: 1.6em
        .name
          font-size: 2.2em
    .house-content
      padding: $spacing
      +border-box
      .title
        +font-dpr(25px)
        padding-bottom: $spacing/3
        border-bottom: 1px solid $grey-700
      .body
        +font-dpr(17px)
        margin: $spacing 0
        text-indent: 2em
        color: $grey-600
      .house-introduce
      .house-character
        .character-item
          margin: $spacing 0
          img
            display: inline-block
            vertical-align: top
            width: 30%
          .desc
            display: inline-block
            vertical-align: top
            width: 65%
            padding-left: 5%
            display:inline-block
            +font-dpr(10px)
            .name
              font-size: 1.7em
              color: $black
              margin-bottom: $spacing
            .introducion
              font-size: 1.4em
              color: $grey-600
              line-height: $spacing
      .house-section > *
        width: 100%
        margin-top: $spacing
</style>