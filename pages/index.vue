<template lang='pug'>
  .container
    .house(ref="house")
      .house-item(v-for="(item, index) in houses" :key="index" @click="_goToDetailHousePage(item._id)")
        .house-text
          p.name {{item.words}}
          p.intro {{item.name}}
          p.cname {{item.cname}}
        .house-img-wrapper
          img(:src= 'imageCdnPrefix + item.cname + ".jpg"')
    .character(ref="character")
      .title 主要人物
      .character-wrapper
        .character-item(v-for="(item, index) in characters" :key="index" @click="_goToDetailCharacterPage(item._id)")
          img(:src='imageCdnPrefix + item.profile')
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
    data() {
      return {
        cities: [
          {
            title: '北境',
            body: '北境是颈泽以北的地带，临冬城的史塔克家族作为北境之王和伊耿征服后的北境守护已统治了数千年之久。'
          },
          {
            title: '铁群岛',
            body: '铁群岛是位于大陆西海岸铁民湾中的一组群岛，它们分别是派克岛，大威克岛，老威克岛，哈尔洛岛，盐崖岛，黑潮岛和奥克蒙岛。'
          },
          {
            title: '河间地',
            body: '河间地是位于三叉戟河流域的肥沃地带。他们的统治者是奔流城的徒利家族。在远古的河流王灭绝后，河间地进入一个动荡的历史时期，其他的南方王国纷纷入侵，河间地多次易主。'
          },
          { title: '艾林谷',
            body: '谷地是一处几乎被明月山脉完全环绕的区域，他们的统治者是艾林家族，是最古老的安达尔人贵族之一，在伊耿征服之前是山岭和谷地之王。'
          },
          { title: '西境',
            body: '西境位于河间地以西和河湾以北，由凯岩城的兰尼斯特家族统治，他们是从前的岩地之王。'
          },
          { title: '河湾',
            body: '河湾是由高庭的提利尔家族所统治的肥沃土地。提利尔家族原本是园丁家族的总管，园丁家族是伊耿征服之前的河湾王。'
          },
          {
            title: '风暴之地',
            body: '风暴之地位于君临和多恩海之间，在东边则是被破船湾和多恩海与南方分隔开来。'
          },
          {
            title: '多恩',
            body: '多恩是维斯特洛最南部的土地，从多恩边境地的高山一直延伸到大陆的南海岸。这里是维斯特洛最炎热的国度，拥有大陆上仅有的沙漠。'
          },
          {
            title: '王领',
            body: '王领是铁王座之王的直属领地。这块区域包括君临以及周围地带的罗斯比城和暮谷城。'
          },
          {
            title: '龙石岛',
            body: '龙石岛是位于狭海中的岛屿要塞，同时管理着狭海中的一些其他岛屿如潮头岛和蟹岛，以及位于大陆上的尖角要塞。'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'houses',
        'characters',
        'imageCdnPrefix'
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
        'getCharactersData'
        // 'getCitiseData'
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
        width: 93%
        margin-left: $spacing/2
        font-size: 0px
        &:first-child
          margin-left: $spacing
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
        .house-img-wrapper
          width: 100%
          box-shadow: 0 1px 2px rgba(0, 0, 0, .2)
          overflow: hidden
          img
            width: 100%

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