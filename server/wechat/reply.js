const TEST_MESSAGE = '测试被动回复reply.js'
export default async (ctx, next) => {
  const message = ctx.wechat
  console.log(message)
  ctx.body = TEST_MESSAGE
}