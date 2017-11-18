<template lang='pug'>
  .container
    .character-header
      img.character-header-bg(v-if='currentCharacter.images' :src='currentCharacter.images[currentCharacter.images.length - 1]')
      //-img.character-header-bg(v-if='currentCharacter.images' :src='https://fireice.iblack7.com/Cersei Lannister/p7c6ly3akeoqa5q0xnjkpssuh32j847j?imageView2/1/w/375/h/230/format/jpg/q/90|imageslim')
      .character-media
        img(v-if='currentCharacter.profile', :src='currentCharacter.images')
        .character-desc
          .character-text-wrapper
            p.cname {{currentCharacter.cname}}
            p.name {{currentCharacter.name}}
    .character-content
      .introduce
        p(v-for='item in currentCharacter.intro') {{ item }}
      .stills
        img(v-for='(item, index) in currentCharacter.images' :key='index' :src='item')
      //-.focusCharacter-stills
      //-img(v-for='item in character.images', :src="imageCDN + item + '?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim'")
      .character-section(v-for='(item, index) in currentCharacter.sections' :key='index') 
        .title {{item.title}}
        .body(v-for='text in item.content') {{ text }}
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  head () {
    return {
      title: '家族成员详情'
    }
  },
  computed: {
    ...mapGetters([
      'currentCharacter'
    ])
  },
  created() {
    const characterId = this.$route.query.id
    this._getCharactersDataById(characterId)
  },
  methods: {
    _getCharactersDataById(characterId) {
      this.getCharactersData(characterId)
    },
    ...mapActions([
      'getCharactersData'
    ])
  }
}
</script>
<style scoped lang='sass'>
  @import '~static/sass/mixin'
  @import '~static/sass/color'
  @import '~static/sass/var'
  .container
    .character-header
      position: relative
      height: 8rem
      margin-bottom: $spacing
      overflow: hidden
      .character-header-bg
        position: absolute
        width: 100%
        top: 0
        left: 0
        filter: brightness(80%) opacity(50%) grayscale(70%)
        -webkit-filter: brightness(80%) opacity(50%) grayscale(70%)
      .character-media
        +border-box
        position: absolute
        width: 100%
        height: 70%
        padding: 0 $spacing
        bottom: 0
        left: 0
        z-index: 2
        font-size: 0
        > *
          display: inline-block
          vertical-align: middle
          height: 100%
        img
         max-width: 40%
        .character-desc
          width: 60%
          +font-dpr(10px)
          position: relative

          > *
            position: absolute
          .character-text-wrapper
            color: $white
            line-height: 230%
            top: 30%
            left: $spacing
            .cname
              font-size: 2.1em
            .name
              font-size: 1.7em
    .character-content
      +border-box
      +font-dpr(10px)
      
      .title
        +font-dpr(25px)
        padding-bottom: $spacing/3
        border-bottom: 1px solid $grey-400
      .body
        +font-dpr(17px)
        margin: $spacing 0
        text-indent: 2em
        color: $grey-600
      >*:not(.stills)
        padding: 0 $spacing

      .introduce
        font-size: 2em
        text-indent: 2em
        color: $grey-600
      .stills
        +x-scroll
        padding: $spacing 0 $spacing $spacing
        img
          width: 80%
        img:not(:last-child)
          margin-right: $spacing/2
      
</style>