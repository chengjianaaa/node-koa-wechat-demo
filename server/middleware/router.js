import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'
import reply from '../wechat/reply'
import wechatMessageMiddleware from '../wechat-lib/middleware'
export const router = app => {
  const router = new Router()
  router.get('/test', (ctx, next) => {
    require('../wechat')
  })
  router.get('/test/isfromwechat', (ctx, next) => {
    const token = config.wechat.token
    const {
        signature,
        nonce,
        timestamp,
        echostr
    } = ctx.query
    console.log('测试微信验证')
    console.log(ctx.query)
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    if (sha === signature) {
      console.log('来自微信')
      ctx.body = echostr
    } else {
      ctx.body = 'Signature Error'
    }
  })
  router.all('/wechat', wechatMessageMiddleware(config.wechat, reply))
  app.use(router.routes())
  app.use(router.allowedMethods())
}