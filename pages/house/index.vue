<template lang='pug'>
  .container
    .house-banner
      .desc
        .words {{ currentHouse.words }}
        .name {{ currentHouse.name }}
    .house-content
      .house-introduce
        .title {{currentHouse.cname}}
        .body {{currentHouse.intro}}
      .house-character
        .title 主要角色
        .character-item(v-for="(item, index) in currentHouse.swornMenbers" :key='index')
          img(:src="item.profile")
          .desc
            .name {{item.cname}}
            .introducion {{item.text}}
      .house-section(v-for='(item, index) in currentHouse.sections' :key='index') 
        .title {{item.title}}
        .body(v-for='text in item.content') {{ text }}
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  head () {
    return {
      title: '家族详情'
    }
  },
  computed: {
    ...mapGetters([
      'currentHouse'
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
      .desc
        font-size: 10px
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
              line-height: $spacing
      .house-section > *
        width: 100%
        margin-top: $spacing
</style>