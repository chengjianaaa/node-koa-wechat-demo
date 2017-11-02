import axios from 'axios'
//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
const API_BASE = 'https://api.weixin.qq.com/cgi-bin/'
const API = {
  GET_ACCESS_TOKEN: API_BASE + 'token?grant_type=client_credential'
}
export default class Wechat {
  constructor(options) {
    this.options = Object.assign({}, options)
    this.appID = options.appID
    this.appSecret = options.appSecret
    this.getAccessToken = options.getAccessToken
    this.saveAccessToken = options.saveAccessToken

    this.fetchAccessToken()
    // this.updateAccessToken()
  }

  async fetchAccessToken() {
    // 从缓存里面取AccessToken
    let token = await this.getAccessToken()
    
    // 校验AccessToken是否失效
    !this.isValidAccessToken(token) && (token = await this.updateAccessToken())

    // 保存AccessToken
    await this.saveAccessToken(token)

    return token
  }

  async updateAccessToken() {
    console.log('开始更新accesstoken')
    // 进行网络请求
    const url = API.GET_ACCESS_TOKEN + '&appid=' + this.appID + '&secret=' + this.appSecret
    let { data } = await axios.get(url)
    console.log(data)
    // TODO 判断是否更新成功 => 有没有errcode字段
    const now = (new Date().getTime()) // 返回距离1970.1.1有多少毫秒
    const expiresIn = now + (data.expires_in - 20) * 1000 // data.expires_in单位为秒(7200 => 2小时) 需要将 秒 转为 毫秒( * 1000)
    data.expires_in = expiresIn
    return data
  }

  isValidAccessToken(token) {
    if (!token || !token.access_token || !token.expires_in) {
      console.log('该access_token 格式不合法')
      return false
    }
    const expiresIn = token.expires_in
    const now = (new Date().getTime())
    // return now < expiresIn ? true : false
    if (now >= expiresIn) {
      console.log('access_token 已过期')
      return false
    }
    console.log('access_token 未过期')
    return true
  }
}