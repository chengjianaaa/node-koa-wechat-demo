<template lang='pug'>
  .container
    .house(ref="house")
      .house-item(v-for="(item, index) in houses" :key="index" @click="_goToDetailHousePage(item._id)")
        .house-text
          p.name {{item.words}}
          p.intro {{item.name}}
          p.cname {{item.cname}}
        //- .house-img-wrapper
        //-   img(:src="imageCDN + item.cname")
    .character(ref="character")
      .title 主要人物
      .character-wrapper
        .character-item(v-for="(item, index) in characters" :key="index" @click="_goToDetailCharacterPage(item._id)")
          img(:src="item.profile")
          .desc
            .cname {{item.cname}}
            .name {{item.name}}
            .playedBy {{item.playedBy}}
    .city(ref="city") 
      .title 维斯特洛
      img.bg(src="http://oqncgivnd.bkt.clouddn.com/map/bg2.png")
      .intro 坐落于已知世界的最西端，狭长的维斯特洛大陆由北部的极地冰盖起向南延绵约3,000英里。绝境长城是一座巍峨挺立的不可逾越之物，横跨300英里，将最北的塞外地区与七大王国相互分离。一个统一的政治实体领导着南方的广阔土地，并形成九块相互联系又相互割据的区域。
      .city-item(v-for="(item, index) in cities" :key="index")
        .title {{item.title}}
        .body {{item.body}}
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    head () {
      return {
        // 本页面的<head>中的<title>
        title: '冰火脸谱'
      }
    },
    computed: {
      ...mapGetters([
        'houses',
        'characters',
        'cities'
      ])
    },
    created() {
      console.log('created')
      // 请求所有家族和主要人物
      this._getHousesData()
      this._getCharactersData()
      // this.getCitiseData()
    },
    methods: {
      _goToDetailHousePage(id) {
        console.log('_goToDetailHousePage --id --' + id)
        // 路由跳转到house，附带查询参数id
        this.$router.push({ path: '/house', query: { id: id } })
      },
      _goToDetailCharacterPage(id) {
        console.log('_goToDetailCharacterPage --id --' + id)
        // 路由跳转到character，附带查询参数id
        this.$router.push({ path: '/character', query: { id: id } })
      },
      _getHousesData(id){
        this.getHousesData(id)
      },
      _getCharactersData(id){
        this.getCharactersData(id)
      },
      ...mapActions([
        'getHousesData',
        'getCharactersData',
        'getCitiseData'
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
    .house
      padding: 0 0 $spacing
      +x-scroll // TODO
      .house-item
        display: inline-block
        width: 90%
        margin-left: $spacing/2
        font-size: 0px
        .house-text
          width: 100%
          padding: $spacing/2 0
          +font-dpr(10px) // TODO
          +border-box
          +break-word // TODO
          .words
            font-size: 1.4em
            color: $grey-700
          .cname
            font-size: 1.9em
            color: $black
          .name
            font-size: 1.8em
            color: $grey-700
    .character
      padding: 0 $spacing
      margin-bottom: $spacing
      background: $white
      +border-box
      .title
        border-top: 1px solid $grey-400
        padding: $spacing 0
        +font-dpr(19px)
      .character-wrapper
        padding: 0 0 $spacing
        border-bottom: 1px solid $grey-400
        font-size: 0
        .character-item:nth-child(2n)
          margin-left: 5%
        .character-item
          display: inline-block
          width: 47.5%
          margin-bottom: $spacing
          +break-word
          img
            width: 100%
            box-shadow: 0 0 2px rgba(0, 0, 0, .2)
            margin-bottom: $spacing/3
          .desc
            +font-dpr(10px)
            .cname
              font-size: 1.5em
              color: $black
            .name
              font-size: 1.2em
              color: $grey-600
            .playedBy
              font-size: 1.2em
              color: $grey-600
    .city
      position: relative
      padding: 0 $spacing $spacing
      +border-box
      +font-dpr(10px)
      line-height: 2em
      .title
        font-size: 1.9em
        padding-bottom: $spacing 
      .bg
        position: absolute
        width: 100%
        z-index: 0
        top: 3rem
        opacity: .3
      .intro
        font-size: 1.6em
        color: $grey-800
      .city-item
        font-size: 1.45em
        color: $grey-700
        margin-top: $spacing*2
</style>