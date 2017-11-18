import { getWechat, getOAuthWechat } from '../wechat/'

// const wechatClient = getWechat() // 拿到wechat类实例
export async function getSignatureAsync(url) {
  console.log('--------api --- getSignatureAsync----------')
  const wechatClient = getWechat() // 拿到wechat类实例
  // 拿到AccessToken
  console.log('---------await wechatClient.fetchAccessToken()----------')
  const { access_token: accessToken } = await wechatClient.fetchAccessToken()
  console.log(accessToken)
  // 根据AccessToken拿到Ticket
  const { ticket } = await wechatClient.getTicket(accessToken)
  console.log(ticket)
  // 组装请求参数
  let options = wechatClient.sign(ticket, url)
  options.appId = wechatClient.appID
  console.log('--------api --- getSignatureAsync----------APPID')
  console.log(wechatClient.appID)
  console.log(options.appId)
  return options
}
export function getAuthorizeCodeURL(redirectUrl, state, scope) {
  const OAuthWechatClient = getOAuthWechat()
  return OAuthWechatClient.getAuthorizeCodeURL(redirectUrl, state, scope)
}

export async function getUserByCode(code) {
  const OAuthWechatClient = getOAuthWechat()
  // code => access_token
  const accessToken = await OAuthWechatClient.fetchAccessToken(code)
  console.log('------api------getUserByCode-----')
  console.log(accessToken.data)
  const userInfo = await OAuthWechatClient.getUserInfo(accessToken.data.access_token, accessToken.data.openid)
  return userInfo
}