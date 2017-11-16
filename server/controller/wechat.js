import * as api from '../api/'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

const SCOPE_TYPE_SNSAPI_BASE = 'snsapi_base'
const SCOPE_TYPE_SNSAPI_USERINFO = 'snsapi_userinfo'
export async function signature(ctx, next) {
  console.log('--------controller -- signature ----------')
  // 拿到当前url
  let currentUrl = ctx.query.url
  if (!currentUrl) {
    ctx.throw(404)
  }
  currentUrl = encodeURIComponent(currentUrl)
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

export async function redirect(ctx, next) {
  // let redirect = config.SITE_ROOT_URL + '/oauth'
  // let scope = 'snsapi_userinfo'
  // const { visit, id } = ctx.query
  // const params = id ? `${visit}_${id}` : visit

  // const url = wechat.getAuthorizeURL(scope, redirect, params)

  // ctx.redirect(url)
  // 转到 微信验证的 网页
  // 拿到当前网页带的参数
  console.log('-------controller------ redirect -------')
  let redirectUrl = config.site_root_url + '/testoauth' // 这会跳到获取信息的路由(前端页面)
  let scope = SCOPE_TYPE_SNSAPI_USERINFO
  const { a, b } = ctx.query
  const params = `${a}_${b}`

  const authorizeUrl = api.getAuthorizeCodeURL(redirectUrl, params, scope)
  console.log('-------controller------ redirect -------authorizeUrl   ---- ' + authorizeUrl)
  ctx.redirect(authorizeUrl)
}

export async function oauth(ctx, next) {
  console.log('-------controller------ oauth -------')
  // 拿到 参数 code 和 state 
  console.log(ctx.url)
  const beforeUrl = ctx.query.url
  console.log(beforeUrl)
  console.log(decodeURIComponent(beforeUrl))
  const urlObj = urlParse(decodeURIComponent(beforeUrl))
  const params = queryParse(urlObj.query)
  const code = params.code
  const userInfo = await api.getUserByCode(code)
  console.log(userInfo.data)
  // 换取 access_token

  // 用 access_token 和 openId 换取 用户信息

  // 返回用户信息给前端
  ctx.body = {
    success: true,
    userInfo: userInfo.data
  }
}