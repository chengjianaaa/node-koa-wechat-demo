import { getWechat, getOAuthWechat } from '../wechat/'

export async function getSignatureAsync(url) {
  try {
    console.log('--------api --- getSignatureAsync----------')
    const wechatClient = getWechat() // 拿到wechat类实例
    // 拿到AccessToken
    console.log('---------await wechatClient.fetchAccessToken()----------')
    const { access_token: accessToken } = await wechatClient.fetchAccessToken()
    // 根据AccessToken拿到Ticket
    const { ticket } = await wechatClient.getTicket(accessToken)
    // 组装请求参数
    let options = wechatClient.sign(ticket, url)
    options.appId = wechatClient.appID
    console.log('--------api --- getSignatureAsync----------APPID')
    return options
  } catch (error) {
    throw error
  }
}
// 组装微信网页授权(获取code)的url
export function getAuthorizeCodeURL(redirectUrl, state, scope) {
  const OAuthWechatClient = getOAuthWechat()
  return OAuthWechatClient.getAuthorizeCodeURL(redirectUrl, state, scope)
}
// 用 access_token 和 openId 获取微信网页授权 的用户信息
export async function getUserByCode(code) {
  try {
    const OAuthWechatClient = getOAuthWechat()
    // code => access_token
    // 获取 access_token
    const accessToken = await OAuthWechatClient.fetchAccessToken(code)
    console.log('------api------getUserByCode-----')
    console.log(accessToken.data)
    // access_token + openid => 微信用户信息
    const userInfo = await OAuthWechatClient.getUserInfo(accessToken.data.access_token, accessToken.data.openid)
    return userInfo
  } catch (error) {
    throw error
  }
}