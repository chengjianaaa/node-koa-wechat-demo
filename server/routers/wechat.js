import { controller, get, post } from '../decorator/router'
import wechatMessageMiddleware from '../wechat-lib/middleware'
import { signature, redirect, oauth } from '../controller'
import config from '../config'
import reply from '../wechat/reply'
@controller('')
export class WeChatController {
  @get('/wechat')
  async weChatHear(ctx, next) {
    const replyMiddleware = wechatMessageMiddleware(config.wechat, reply)
    return replyMiddleware(ctx, next)
  }
  @post('/wechat')
  async weChatHearReply(ctx, next) {
    const replyMiddleware = wechatMessageMiddleware(config.wechat, reply)
    return replyMiddleware(ctx, next)
  }
  // 拿到sdk权限
  @get('/wechat-signature')
  async weChatSignature(ctx, next) {
    return signature(ctx, next)
  }
  // 网页授权
  @get('/wechat-redirect')
  async weChatRedirect(ctx, next) {
    return redirect(ctx, next)
  }
  @get('/wechat-oauth')
  async weChatOauth(ctx, next) {
    return oauth(ctx, next)
  }
} 