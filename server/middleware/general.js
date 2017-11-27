import koaBody from 'koa-bodyparser'

export const addBody = app => {
  app.use(koaBody())
}
// 拓展API接口
export const extendAPIFunc = app => {
  app.use(async (ctx, next) => {
    ctx.apiSuccess = (data) => {
      ctx.body = {
        success: true,
        data: data
      }
    }
    ctx.apiError = (err) => {
      ctx.body = {
        success: false,
        err: err || 'unknown error'
      }
    }
    await next()
  })
}