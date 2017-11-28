import xss from 'xss'
import R from 'ramda'
import { controller, get, post, put, del } from '../decorator/router'
import api from '../api'
import * as qiniu from '../libs/qiniu'

function formatAndFilterProductData(preUpdateProduct, newProduct) {
  console.log(newProduct)
  preUpdateProduct.title = newProduct.title ? xss(newProduct.title) : preUpdateProduct.title ? preUpdateProduct.title : 'null'
  preUpdateProduct.price = newProduct.price ? xss(newProduct.price) : preUpdateProduct.price ? preUpdateProduct.price : 'null'
  preUpdateProduct.intro = newProduct.intro ? xss(newProduct.intro) : preUpdateProduct.intro ? preUpdateProduct.intro : 'null'
  preUpdateProduct.images = newProduct.images ? R.map(xss)(newProduct.images) : preUpdateProduct.images
  preUpdateProduct.parameters = newProduct.parameters ? R.map(
    i => ({
      key: xss(newProduct.key),
      value: xss(newProduct.value)
    })
  )(newProduct.parameters) : preUpdateProduct.parameters
  return preUpdateProduct
}
@controller('/api')
export class ProductController {
  @get('/product')
  async getProduct(ctx, next) {
    // 获取查询参数limit
    const { limit = 10 } = ctx.query
    try {
      // 查询数据库
      const retData = await api.product.getProduct(limit)
      // 整理数据
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---product---getProduct---失败')
      ctx.apiError('获取产品数据失败')
    }
  }
  @get('/product/:id')
  async getProductById(ctx, next) {
    // 获取查询参数id
    const { params } = ctx // ctx.params 是koa-router拓展的字段
    const { id } = params
    // 校验id
    if (!id) {
      return api.apiError('必须传一个id')
    }
    try {
      // 查询数据库
      let retData = await api.product.getProductById(id)
      // 建议数据
      if (!retData) {
        console.log('你查找的产品不存在')
        return ctx.apiError('你查找的产品不存在')
      }
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---product---getProductById---失败')
      ctx.apiError('查找的产品不存在')
    }
  }
  @post('/product')
  async postProduct(ctx, next) {
    // 获取上传的表单参数
    let product = ctx.request.body
    if (!product) {
      console.log('postProduct上传post的不存在')
      return api.apiError('postProduct上传post的不存在')
    }
    // 校验xss
    let prePostProduct = {}
    prePostProduct = formatAndFilterProductData(prePostProduct, product)
    try {
      // 保存数据库
      const retData = await api.product.postProduct(prePostProduct)
      // 整理数据
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---product---postProduct---失败')
      ctx.apiError(error)
    }
  }
  @put('/product')
  async putProduct(ctx, next) {
    // 获取上传的product._id
    let product = ctx.request.body
    let { _id } = product
    console.log(_id)
    // 校验
    if (!_id) {
      console.log('putProduct待更新_id的不存在')
      return ctx.apiError('product._id is required')
    }
    let preUpdateProduct
    // 查看数据库是否存在该_id的数据
    try {
      preUpdateProduct = await api.product.getProductById(_id)
      // 校验
      if (!preUpdateProduct) {
        return ctx.apiError('product not exist')
      }
    } catch (error) {
      console.log('待更新的产品不存在')
      return ctx.apiError(error)
    }
    // 校验xss
    // 更新数据
    preUpdateProduct = formatAndFilterProductData(preUpdateProduct, product)
    try {
      // 更新数据库数据
      const retData = await api.product.putProduct(preUpdateProduct)
      // 整理数据
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---product---putProduct---失败')
      ctx.apiError(error)
    }
  }
  @del('/product/:id')
  async delProduct(ctx, next) {
    // 获取查询参数product.id
    const { params } = ctx // ctx.params 是koa-router拓展的字段
    const { id } = params
    // 校验
    if (!id) {
      console.log('delProduct待删除_id的不存在')
      return ctx.apiError('product._id is required')
    }
    let preUpdateProduct
    try {
      // 查看数据库是否存在该_id的数据
      preUpdateProduct = await api.product.getProductById(id)
      // 校验
      if (!preUpdateProduct) {
        return ctx.apiError('待删除的产品不存在')
      }
    } catch (error) {
      console.log('待删除的产品不存在')
      return ctx.apiError(error)
    }
    // 删除数据库中的数据
    try {
      const retData = await api.product.delProduct(preUpdateProduct)
      // 整理数据
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---product---delProduct---失败')
      ctx.apiError(error)
    }
  }
  @get('/qiniu/uploadtoken')
  async getQiniuUploadToken(ctx, next) {
    // 拿到key
    const { key } = ctx.query // ?key=xxx
    // 调用后端api
    let retData = qiniu.getUploadtoken(key)
    // console.log(retData)
    // 返回数据
    ctx.apiSuccess({
      key: key,
      token: retData
    })
  }
} 