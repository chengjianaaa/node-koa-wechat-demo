import api from '../api/'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

const SCOPE_TYPE_SNSAPI_BASE = 'snsapi_base'
const SCOPE_TYPE_SNSAPI_USERINFO = 'snsapi_userinfo'
// 签名
export async function signature(ctx, next) {
  console.log('--------controller -- signature ----------')
  // 拿到当前url
  let currentUrl = ctx.query.url
  if (!currentUrl) {
    ctx.throw(404)
  }
  currentUrl = encodeURIComponent(currentUrl)
  try {
    // 组装进行签名的参数
    const options = await api.wechat.getSignatureAsync(currentUrl)
    console.log('--------组装进行签名的参数----------')
    // 返回组装好的前面参数 给前端
    ctx.body = {
      success: true,
      params: options
    }
  } catch (error) {
    ctx.apiError(error)
  }
}
// 引导用户同意授权获取code
export async function redirect(ctx, next) {
  // 转到 微信验证的 网页
  // 拿到当前网页带的参数
  console.log('-------controller------ redirect -------' + ctx.url)
  let redirectUrl = config.site_root_url + '/oauth' // 这会跳到获取信息的路由(前端页面)
  // 组装跳转前的参数
  let scope = SCOPE_TYPE_SNSAPI_USERINFO
  const { visit, id } = ctx.query
  const params = id ? `${visit}_${id}` : visit
  // 组装微信网页授权(获取code)的url
  const authorizeUrl = api.wechat.getAuthorizeCodeURL(redirectUrl, params, scope)
  console.log('-------controller------ redirect -------authorizeUrl   ---- ' + authorizeUrl)
  // 重定向微信网页授权的url(需要统一授权)
  ctx.redirect(authorizeUrl)
}

// 获取微信用户信息
export async function oauth(ctx, next) {
  console.log('-------controller------ oauth -------')
  // 拿到 参数 code 和 state 
  const beforeUrl = ctx.query.url
  const urlObj = urlParse(decodeURIComponent(beforeUrl))
  const params = queryParse(urlObj.query)
  const code = params.code
  try {
    // 换取 access_token
    // 用 access_token 和 openId 换取 用户信息
    const userInfo = await api.wechat.getUserByCode(code)
    // 返回用户信息给前端
    ctx.apiSuccess(userInfo.data)
  } catch (error) {
    ctx.apiError(error)
  }
}