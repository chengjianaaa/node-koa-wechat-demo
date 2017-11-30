<template lang='pug'>
  .content
    .product-table-wrapper
      table.table
        thead
          tr
            th 图片
            th 标题
            th 价格
            th 简介
            th 参数
            th 修改
        tbody
          tr(v-for='(item, index) in products' :key='index')
            td
              .img(v-for='image in item.images')
                img(:src='imageCdnPrefix + image')
            td {{item.title}}
            td {{item.price}}
            td(v-html='item.intro')
            td
              p(v-for='parameter in item.parameters') {{parameter.key}}  {{parameter.value}}
            td.button-wrapper
              button.btn(@click='editProduct(item, index)')
                .material-icon edit
              button.btn(@click='deleteProduct(item, index)')
                .material-icon delete
    .product-edit-wrapper(:class='{active: isEditing}')
      .edit-header
        .material-icon edit
        .close-wrapper
          .material-icon.close(@click='isEditing =! isEditing') close
      .edit-body
        .form.edit-form
          .input-group
            label 标题
            input(v-model='edited.title')
          .input-group
            label 价格
            input(v-model='edited.price', type='number')
          .input-group
            label 简介
            textarea(v-model='edited.intro', @keyup='editedIntro')
          .input-group
            label 图片
            .upload-images
              .img(v-for='item, index in edited.images')
                img(:src='imageCdnPrefix + item + "?imageView2/1/format/jpg/q/75/imageslim"')
                .tools()
                  .material-icon(@click='deleteImg(index)') delete
              .upload-btn
                g#Page-1(stroke='none', stroke-width='1', fill='none', fill-rule='evenodd')
                  g#ic_backup_black_24px(transform='translate(-1.000000, -6.000000)')
                    polygon#Shape(points='0 0 55 0 55 55 0 55')
                    path#outline(d='M42.6907609,20.7503727 C41.2853571,13.6200155 35.0230435,8.26708075 27.5,8.26708075 C21.5270342,8.26708075 16.339441,11.6565839 13.7559783,16.6168323 C7.535,17.2781988 2.69875776,22.5484627 2.69875776,28.9347826 C2.69875776,35.7757919 8.25836957,41.3354037 15.0993789,41.3354037 L41.9673913,41.3354037 C47.671677,41.3354037 52.3012422,36.7058385 52.3012422,31.0015528 C52.3012422,25.5452795 48.0643634,21.1223913 42.6907609,20.7503727 Z', stroke='#78909C', stroke-width='3', :stroke-dasharray='upload.dasharray', :stroke-dashoffset='upload.dashoffset')
                    path#Shape(d='M42.6907609,20.7503727 C41.2853571,13.6200155 35.0230435,8.26708075 27.5,8.26708075 C21.5270342,8.26708075 16.339441,11.6565839 13.7559783,16.6168323 C7.535,17.2781988 2.69875776,22.5484627 2.69875776,28.9347826 C2.69875776,35.7757919 8.25836957,41.3354037 15.0993789,41.3354037 L41.9673913,41.3354037 C47.671677,41.3354037 52.3012422,36.7058385 52.3012422,31.0015528 C52.3012422,25.5452795 48.0643634,21.1223913 42.6907609,20.7503727 Z M31.6335404,26.8680124 L31.6335404,35.1350932 L23.3664596,35.1350932 L23.3664596,26.8680124 L17.1661491,26.8680124 L27.5,16.5341615 L37.8338509,26.8680124 L31.6335404,26.8680124 Z', fill='#CFD8DC', fill-rule='nonzero')
                .text 上传图片
                input(type='file', @change='uploadImg($event)')
          .input-group
            label 参数
            .parameters
              transition-group(name="delay" tag="div" )
                .parameter-item(v-for='(item, index) in edited.parameters' v-bind:key='index')
                  input(v-model='item.key', placeholder='名称')
                  input(v-model='item.value', placeholder='值')
                  .remove(@click='removeParameter(index)')
                    .material-icon remove
        .edit-footer
          button.btn.save(@click='saveEdited') {{ saveBtnText }}
          .btn.add-parameter(@click='addParameter')
            .material-icon add
            | 添加参数
    .float-btn(@click="createProduct")
      .material-icon add
      //- TODO: 确定删除框
    v-snackbar(:open.sync='isOpenSnackbar' @update:open='onSnackBarClose')
      span(slot='body') {{ openSnackText }}
    .mask(v-show="isEditing" @click='onMaskClick')
</template>
<script>
import axios from 'axios'
import randomToken from 'random-token'
import Uploader from 'qiniu-web-uploader'
import { mapGetters, mapActions } from 'vuex'
import vSnackbar from '~components/snackbar'
import * as types from '../../store/mutations_type'

const FAIL_POST_CODE = 'fail_post_code' // 上传product失败
const FAIL_PUT_CODE = 'fail_put_code' // 更新product失败
const FAIL_DEL_CODE = 'fail_del_code' // 删除product失败
const SUCCESS_POST_CODE = 'success_post_code' // 上传product成功
const SUCCESS_PUT_CODE = 'success_put_code' // 更新product成功
const SUCCESS_DEL_CODE = 'success_del_code' // 删除product成功
// qiniu-web-uploader 的配置
const QINIU_UPLOAD_URL= '//up-z2.qiniu.com/' // 华南
const BLOCK_SIZE = 1024 * 1024 * 4
const CHUNK_SIZE = 1024 * 128

export default {
  layout: 'admin', // 里面包含鉴定是否登录的中间件
  head() {
    return {
      title: '手办录入页面'
    }
  },
  data() {
    return {
      isEditing: false, // 是否在编辑
      isUpdateProduct: false, // 是否在更新产品
      isOpenSnackbar: false, // 是否打开snackbar
      apiResultCode: FAIL_POST_CODE, // API本地状态码映射
      edited: {
        images: [],
        parameters: []
      },
      upload: {
        dasharray: 0,
        dashoffset: 0
      },
    }
  },
  computed: {
    openSnackText() {
      const textMap = {
        [FAIL_POST_CODE]: '保存失败',
        [FAIL_PUT_CODE]: '更新失败',
        [FAIL_DEL_CODE]: '删除失败',
        [SUCCESS_POST_CODE]: '保存成功',
        [SUCCESS_PUT_CODE]: '更新成功',
        [SUCCESS_DEL_CODE]: '删除成功',
      }
      return textMap[this.apiResultCode]
    },
    saveBtnText() {
      return this.isUpdateProduct ? '保存修改' : '创建宝贝'
    },
    ...mapGetters([
      'products',
      'imageCdnPrefix'
    ])
  },
  created() {
    this.getProductsData()
  },
  methods: {
    // 新建产品
    createProduct() {
      this.isEditing = ! this.isEditing
      if(this.isUpdateProduct) {
        this.edited = {
          images: [],
          parameters: []
        }
      }
      this.isUpdateProduct = false
    },
    // 增加参数(editor)
    addParameter() {
      this.edited.parameters.push({
        key: '',
        value: ''
      })
    },
    // 删除参数(editor)
    removeParameter(index) {
      // 拿到当前的DOM id
      this.edited.parameters.splice(index,1)
    },
    // 保存修改
    async saveEdited() {
      // 调用接口,传递this.edited(v-modl双向绑定)
      let result = null
      console.log(this.edited)
      result = this.isUpdateProduct ? await this.putProductsData(this.edited) : await this.postProductsData(this.edited)
      // 判断请求是否成功
      if(result.success === true) {
        // this.isApiSuccess = true
        this.apiResultCode = this.isUpdateProduct ? SUCCESS_PUT_CODE : SUCCESS_POST_CODE
      } else {
        this.apiResultCode = this.isUpdateProduct ? FAIL_PUT_CODE : FAIL_POST_CODE
      }
      this.isOpenSnackbar = true
      // 刷新数据
      if (this.apiResultCode === SUCCESS_POST_CODE) {
        this.products.push(this.edited)
        this.$store.commit(types.SET_PRODUCTS, this.products)
      }
      // 状态复原
      this.isUpdateProduct = false
      this.edited = {
        images: [],
        parameters: []
      }
      this.isEditing = !this.isEditing
    },
    // 替换介绍(textarea)里面的\n字符
    editedIntro(e) {
      // 把换行符变为HTML里面<br />
      let html = e.target.value
      html = html.replace(/\n/g, '<br />')
      this.edited.intro = html
    },
    editProduct(product) {
      // 打开edit界面
      this.isEditing = true
      // 设置当前为更新产品模式
      this.isUpdateProduct = true
      this.edited = product
    },
    async deleteProduct(product, index) {
      let result = await this.delProductsData(product)
      if(result.success === true) {
        this.apiResultCode = SUCCESS_DEL_CODE
      } else {
        this.apiResultCode = FAIL_DEL_CODE
      }
      this.isOpenSnackbar = true
      this.products.splice(index, 1)
    },
    async uploadImg(e) {
      // 获取文件信息
      let file = e.target.files[0]
      let key = `products/${randomToken(32)}` // 保存的文件名
      // 根据key(文件名),获取上传uploadToken
      let uploadedToken = await this.getUploadToken(key)
      console.log('当前uploadedToken---' + uploadedToken)
      // 构建上传需要的参数
      let uploadOption = {
        uptoken: uploadedToken,
        key: Buffer.from(key).toString('base64')
      }
      // 上传
      let uploader = new Uploader(file, uploadOption, BLOCK_SIZE, CHUNK_SIZE, QINIU_UPLOAD_URL)
      uploader.on('progress', () => {
        console.log(uploader.percent)
      })
      let retData = await uploader.upload()
      uploader.cancel()
      // 保存返回的图片字段
      console.log(retData)
      this.edited.images.push(retData.key)
    },
    deleteImg(index) {
      this.edited.images.splice(index, 1)
    },
    async getUploadToken(key) {
      // 调用getUploadToken API
      const retData = await axios.get('/api/qiniu/uploadtoken', {
        params: {
          key: key
        }
      })
      // 判读是否成功
      if(!retData.data.success || retData.data.success === false) {
        return "" // 返回空字符串
      }
      // 返回token
      return retData.data.data.token
    //   {
    // "success": true,
    // "data": {
    //     "key": "xxda121212",
    //     "token": "ylAuw23L1V7QOOhvy_hADo0Q_2HR3qb8l15EA79b:rKbLLViHiC8E3t6x1J5R03ZDSO4=:eyJzY29wZSI6ImljZS1hbmQtZmlyZTp4eGRhMTIxMjEyIiwiZGVhZGxpbmUiOjE1MTE5NDIwMTl9"
    //   }
    // }
    },
    onSnackBarClose() {
      console.log('onSnackBarClose')
      // 复原状态
      this.isApiSuccess = false
    },
    onMaskClick() {
      console.log('onMaskClick')
      this.isEditing = !this.isEditing
    },
    ...mapActions([
      'getProductsData',
      'postProductsData',
      'putProductsData',
      'delProductsData'
    ])
  },
  components: {
    vSnackbar
  }
}
</script>
<style scoped lang='sass'>
  @import '~static/sass/var'
  @import '~static/sass/color'
  @import '~static/sass/mixin'
  .content
    flex: 1
    height: calc(100vh - 56px)
    padding: 10px 16px 50px 16px
    overflow: scroll
    .product-table-wrapper
      .table
        width: 100%
        td
          font-size: 14px
          max-width: 260px
        td.button-wrapper
          display: flex
        .img
          width: 50px
          img
            width: 100%
    .product-edit-wrapper
      width: 480px
      min-height: 200px
      position: fixed
      bottom: 0
      right: 100px
      background-color: $white
      box-shadow: $shadow-4db
      border-radius: 4px 4px 0 0
      transform: translateY(100%)
      transform-origin: top center
      transition: all 275ms $fastOutLinearIn
      z-index: 999
      &.active
        transform: translateY(0)
        transition: all 275ms $linearOutSlowIn
      .edit-header
        width: calc(100% - 32px)
        height: 38px
        padding: 0 16px
        display: flex
        align-items: center
        border-radius: 4px 4px 0 0
        background-color: $grey-800
        color: $white
        .material-icon
          font-size: $title2
          &.close
            cursor: pointer
        .close-wrapper
          flex: 1
          display: flex
          justify-content: flex-end
      .edit-body
        width: calc(100% - 32px)
        max-height: calc(100vh - 200px)
        padding: 16px
        overflow: scroll
        .edit-form
          .input-group
            width: 100%
            min-height: 48px
            display: flex
            align-items: center
            border-bottom: 1px solid $grey-300
            font-size: 14px
            label
              width: 80px
              margin-right: 20px
            input
              flex: 1
              margin: 16px 0
            textarea
              min-height: 100px
              flex: 1
              margin: 16px 0
              border-color: rgba(0, 0, 0, 0.12)
              color: rgba(0, 0, 0, 0.54)
            .upload-images
              flex: 1
              min-height: 150px
              padding: 16px 0
              .img
                width: 154px
                height: 104px
                text-align: center
                float: left
                margin: 0 10px 10px 0
                border: 1px solid$grey-200
                position: relative
                overflow: hidden
                &:hover
                  .tools
                    top: 0
                .tools
                  width: 100%
                  height: 30px
                  line-height: 30px
                  position: absolute
                  top: -30px
                  left: -10px
                  z-index: 2
                  background-color: $grey-800
                  opacity: .7
                  transition: all .1s linear
                  .material-icon
                    // display: inline-block
                    line-height: 30px // 垂直居中
                    font-size: 20px
                    color: $white
                img
                  max-width: 100%
                  max-height: 100%
              .upload-btn
                width: 150px
                height: 100px
                cursor: pointer
                border: 2px dotted$blue-grey-200
                border-radius: 4px
                display: flex
                justify-content: center
                align-items: center
                flex-direction: column
                position: relative
                input
                  width: 100%
                  height: 100%
                  position: absolute
                  top: 0
                  left: 0
                  z-index: 2
                  opacity: 0
                .text
                  color: $blue-grey-400
            .parameters
              flex: 1
              padding: 16px 0
              display: flex
              flex-wrap: wrap // flex多出来部分会换行
              .parameter-item
                flex: 1
                margin-bottom: 10px
                height: 34px
                display: flex
                justify-content: space-between
                &.delay-enter-active, &.delay-leave-active
                  transition: all .2s $fastOutLinearIn
                &.delay-enter, &.delay-leave-to
                  height: 0
                input
                  width: 120px
                  margin-right: 10px
                  margin-top: 0 // 初始化覆盖
                  margin-bottom: 0 // 初始化覆盖
                  flex: 1
                .remove 
                  width: 25px
                  height: 25px
                  margin-top: 3px
                  background-color: $red
                  color: $white
                  font-size: 20px
                  display: flex
                  justify-content: center
                  align-items: center
                  border-radius: 50%
                  cursor: pointer
                  .material-icon
                    font-size: 20px
      .edit-footer
        width: 100%
        padding: 16px
        display: flex
        .btn.save
          background-color: $blue
          color: $white
          box-shadow: $shadow-1db
        .btn.add-parameter
          width: 80px
          margin-left: 30px
          .material-icon
            font-size: 24px
    .float-btn
      display: flex
      width: 56px
      height: 56px
      justify-content: center
      align-items: center
      color: $white
      position: absolute
      bottom: 30px
      right: 26px
      border-radius: 50%
      box-shadow: $shadow-1db
      background-color: $pink
      cursor: pointer
      z-index: 999
      .material-icon
        font-size: 26px
    .btn
      &:focus
        outline: none
      &:hover
        background-color: hsla(0, 0%, 60%, .2)
      min-width: 88px
      min-height: 36px
      padding: 0 16px
      display: flex
      justify-content: center // 水平居中
      align-items: center // 垂直居中
      position: relative
      overflow: hidden
      user-select: none // 不允许复制里面的文本
      cursor: pointer
      background: none
      border: 0 // 去掉默认银色边框
      border-radius: 2px
      color: $grey-900
      font-size: 14px
      font-weight: 500
      transition: all .4s cubic-bezier(.25,.8,.25,1)
    .mask
      position: fixed
      top: 0
      right: 0
      bottom: 0
      left: 0
      background-color: rgba(0,0,0,.3)
      z-index: 998
</style>