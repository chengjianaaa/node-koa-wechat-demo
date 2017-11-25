// import Router from 'koa-router'
// import sha1 from 'sha1'
// import config from '../config'
// import reply from '../wechat/reply'
// import wechatMessageMiddleware from '../wechat-lib/middleware'
// import { signature, redirect, oauth } from '../controller/'

import { resolve } from 'path'
import { Route } from '../decorator/router'
// export const router = app => {
//   const router = new Router()
//   router.all('/wechat', wechatMessageMiddleware(config.wechat, reply))
//   router.get('/wechat-signature', signature)
//   router.get('/wechat-redirect', redirect)
//   router.get('/wechat-oauth', oauth)
//   app.use(router.routes())
//   app.use(router.allowedMethods())
// }
export const router = app => {
  // 拿到保存router的路径
  const routerPath = resolve(__dirname, '../routers')
  const route = new Route(app, routerPath)
  // 开始加载路由
  route.init() 
}