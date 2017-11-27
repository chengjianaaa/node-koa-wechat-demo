import xss from 'xss'
import R from 'ramda'
import { controller, get, post, put, del } from '../decorator/router'
import api from '../api'

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
    product = {
      title: xss(product.title),
      price: xss(product.price),
      intro: xss(product.intro),
      images: R.map(xss)(product.images),
      parameters: R.map(
        i => ({
          key: xss(i.key),
          value: xss(i.value)
        })
      )(product.parameters)
    }
    try {
      // 保存数据库
      const retData = await api.product.postProduct(product)
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
    preUpdateProduct.title = product.title ? xss(product.title) : preUpdateProduct.title
    preUpdateProduct.price = product.price ? xss(product.price) : preUpdateProduct.price
    preUpdateProduct.intro = product.intro ? xss(product.intro) : preUpdateProduct.intro
    preUpdateProduct.images = product.images ? R.map(xss)(product.images) : preUpdateProduct.images
    preUpdateProduct.parameters = product.parameters ? R.map(
      i => ({
        key: xss(product.key),
        value: xss(product.value)
      })
    )(product.parameters) : preUpdateProduct.parameters
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
} 