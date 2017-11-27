import { controller, get } from '../decorator/router'
import api from '../api'

@controller('/wiki')
export class WikiController {
  @get('/house')
  async getHouse(ctx, next) {
    // 获取查询参数limit
    const { limit = 10 } = ctx.query
    try {
      // 查询数据库
      const retData = await api.wiki.getHouse(limit)
      // 整理数据
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---wiki---getHouse---失败')
      ctx.apiError('获取家族数据失败')
    }
  }
  @get('/house/:id')
  async getHouseById(ctx, next) {
    // 获取查询参数id
    const { params } = ctx // ctx.params 是koa-router拓展的字段
    const { id } = params
    // 校验id
    if (!id) {
      return ctx.apiError('必须传一个id')
    }
    try {
      // 查询数据库
      let retData = await api.wiki.getHouseById(id)
      // 校验数据
      if (!retData) {
        console.log('你查找的家族不存在')
        return ctx.apiError('你查找的家族不存在')
      }
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---wiki---getHouseById---失败')
      return ctx.apiError('你查找的家族不存在')
    }
  }
  @get('/character')
  async getCharacter(ctx, next) {
    // 获取查询参数limit
    const { limit = 20 } = ctx.query
    try {
      // 查询数据库
      const retData = await api.wiki.getCharacter(limit)
      // 整理数据
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---wiki---getCharacter---失败')
      ctx.apiError('获取角色数据失败')
    }
  }
  @get('/character/:id')
  async getCharacterById(ctx, next) {
    // 获取查询参数id
    const { params } = ctx
    const { id } = params
    // 校验id
    if (!id) {
      return ctx.apiError('必须传一个id')
    }
    try {
      // 查询数据库
      let retData = await api.wiki.getCharacterById(id)
      // 校验数据
      if (!retData) {
        return ctx.apiError('你查找的角色不存在')
      }
      // 返回JSON数据
      ctx.apiSuccess(retData)
    } catch (error) {
      console.log('controller---wiki---getCharacterById---失败')
      return ctx.apiError('你查找的角色不存在')
    }
  }
}