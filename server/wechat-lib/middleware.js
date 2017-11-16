import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'
const METHOD_GET = 'GET'
const METHOD_POST = 'POST'
const TYPE_XML = 'application/xml'
const TYPE_JSON = 'application/json'
export default function(options, reply) {
  async function wechatMessageMiddleware(ctx, next) {
    // 校验微信验证
    const token = options.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query
    console.log('----------微信的query-------------')
    console.log(ctx.query)
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    // 判断是post/get
    if (ctx.method === METHOD_GET) {      
      if (sha === signature) {
        console.log('GET --- 来自微信')
        ctx.body = echostr
      } else {
        ctx.body = 'GET -- Signature Error'
      }
    } else if (ctx.method === METHOD_POST) {
      console.log('----------微信的POST-------------')
      if (sha !== signature) {
        console.log('POST -- Signature Error')
        ctx.body = 'POST -- Signature Error'
        return false
      }
      console.log('解析微信传过来的xml消息......')
      // 解析微信传过来的xml消息
      const XMLDataFromWechat = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })
      console.log(XMLDataFromWechat)
      console.log('----------接受的数据-------------')
      const JSONDataFromWechat = await util.parseXML(XMLDataFromWechat)
      console.log(JSONDataFromWechat)

      // 提取重要信息(tpl模版需要)
      const message = util.formatMessage(JSONDataFromWechat.xml)
      ctx.formatDataFromWechat = message

      // 根据消息,调用相应的业务逻辑
      await reply.apply(ctx, [ctx, next])
  
      // 组装xml消息返回给微信
      const xml = util.tpl(ctx.formatDataFromWechat, ctx.replyData)
      console.log('----------回复的数据-------------')
      console.log(xml.trim())
      ctx.status = 200
      ctx.type = TYPE_XML
      ctx.body = xml
    }
  }
  return wechatMessageMiddleware
}