import mongoose from 'mongoose'
import config from '../config'
import Wechat from '../wechat-lib'
import OAuthWeChat from '../wechat-lib/oauth'
const Token = mongoose.model('Token')
const Ticket = mongoose.model('Ticket')

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (token) => await Token.saveAccessToken(token),
    getTicket: async () => await Ticket.getTicket(),
    saveTicket: async (ticket) => await Ticket.saveTicket(ticket)
  }
}

export const getWechat = () => {
  const wechatClient = new Wechat(wechatConfig.wechat)
  return wechatClient
}
export const getOAuthWechat = () => {
  const OAuthWeChatClient = new OAuthWeChat(wechatConfig.wechat)
  return OAuthWeChatClient
}