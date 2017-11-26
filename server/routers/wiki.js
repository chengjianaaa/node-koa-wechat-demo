import { controller, get, post } from '../decorator/router'
import api from '../api'

@controller('/wiki')
export class WikiController {
  @get('/house')
  async getHouse(ctx, next) {
    // 获取查询参数limit
    const { limit = 10 } = ctx.query
    // 查询数据库
    const retData = await api.wiki.getHouse(limit)
    // 整理数据
    // 返回JSON数据
    ctx.body = {
      success: true,
      data: retData
    }
  }
  @get('/house/:id')
  async getHouseById(ctx, next) {
    // 获取查询参数id
    const { params } = ctx // ctx.params 是koa-router拓展的字段
    const { id } = params
    // 校验id
    if (!id) {
      return (ctx.body = {
        success: false,
        err: '必须传一个id'
      })
    }
    // 查询数据库
    let retData = await api.wiki.getHouseById(id)
    // 整理数据
    // console.log(retData)
    if (!retData) {
      retData = '你查找的角色不存在'
    }
    // 返回JSON数据
    ctx.body = {
      success: true,
      data: retData
    }
  }
  @get('/character')
  async getCharacter(ctx, next) {
    // 获取查询参数limit
    const { limit = 20 } = ctx.query
    // 查询数据库
    const retData = await api.wiki.getCharacter(limit)
    // 整理数据
    // 返回JSON数据
    ctx.body = {
      success: true,
      data: retData
    }
  }
  @get('/character/:id')
  async getCharacterById(ctx, next) {
    // 获取查询参数id
    const { params } = ctx
    const { id } = params
    // 校验id
    if (!id) {
      return (ctx.body = {
        success: false,
        err: '必须传一个id'
      })
    }
    // 查询数据库
    let retData = await api.wiki.getCharacterById(id)
    // 整理数据)
    if (!retData) {
      retData = '你查找的角色不存在'
    }
    // 返回JSON数据
    ctx.body = {
      success: true,
      data: retData
    }
  }
} 