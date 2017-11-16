import * as api from '../api/'
export async function signature(ctx, next) {
  console.log('--------controller -- signature ----------')
  // 拿到当前url
  const currentUrl = ctx.query.url
  if (!currentUrl) {
    ctx.throw(404)
  }
  // 组装进行签名的参数
  const options = await api.getSignatureAsync(currentUrl)
  console.log('--------组装进行签名的参数----------')
  console.log(options)
  // 返回组装好的前面参数 给前端
  ctx.body = {
    success: true,
    params: options
  }
}