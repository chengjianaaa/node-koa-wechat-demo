import axios from 'axios'

const API_BASE = 'https://api.weixin.qq.com/sns/'
const API = {
  GET_AUTHORIZE_CODE: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  GET_ACCESS_TOKEN: API_BASE + 'oauth2/access_token?',
  GET_USER_INFO: API_BASE + 'userinfo?'
}
const SCOPE_TYPE_SNSAPI_BASE = 'snsapi_base'
const SCOPE_TYPE_SNSAPI_USERINFO = 'snsapi_userinfo'
const LANGUAGE_CHINESE = 'zh_CN' // 简体
const LANGUAGE_S_CHINESE = 'zh_TW' // 繁体
const LANGUAGE_ENGLISH = 'zh_TW' // 英语

export default class OAuthWeChat {
  constructor(options) {
    this.options = Object.assign({}, options)
    this.appID = options.appID
    this.appSecret = options.appSecret
  }
  // 通用请求方法
  async request(options) {
    options = Object.assign({}, options, { json: true })
    try {
      const response = await axios(options)
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  // 组装微信网页授权(获取code)的url
  getAuthorizeCodeURL(redirectUrl, state, scope = SCOPE_TYPE_SNSAPI_BASE) {
    // 组装URL
    const url = `${API.GET_AUTHORIZE_CODE}appid=${this.appID}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
    console.log(redirectUrl)
    console.log('---OAuth------getAuthorizeCodeURL(OAuth)组装的URL-------' + url)
    return url
  }
  // 用 code 获取微信网页授权的access_token
  async fetchAccessToken(code) {
    const url = `${API.GET_ACCESS_TOKEN}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
    console.log('---OAuth------fetchAccessToken(OAuth)组装的URL-------' + url)
    const data = await this.request({ url: url })
    return data
  }

  // 用 access_token 和 openId 获取微信网页授权 的用户信息
  async getUserInfo(accessToken, openId, lang = LANGUAGE_CHINESE) {
    const url = `${API.GET_USER_INFO}access_token=${accessToken}&openid=${openId}&lang=${lang}`
    console.log('---OAuth-----getUserInfo(OAuth)组装的URL-------' + url)
    const data = await this.request({ url: url })
    return data
  }
}