// const TEST_MESSAGE = '测试被动回复reply.js'
// import WeChat from '../wechat/'
const TEST_MESSAGE = '测试被动回复--模版'
export default async (ctx, next) => {
  const message = ctx.formatDataFromWechat
  console.log(message)
  // ctx.replyData = TEST_MESSAGE
  // 判断接收的数据类型
  if (message.MsgType === 'text') {
    ctx.replyData = message.Content
    if (message.Content === '1') {
      console.log('---1--测试XXX接口-----')
      const mp = require('../wechat/')
      let wechatClient = mp.getWechat()
      const menu = {
        "button": [
          {
            "name": "扫A码",
            "sub_button": [
              {
                "type": "scancode_waitmsg",
                "name": "扫码带提示",
                "key": "rselfmenu_0_0",
                "sub_button": []
              },
              {
                "type": "scancode_push",
                "name": "扫码推事件",
                "key": "rselfmenu_0_1",
                "sub_button": []
              }
            ]
          },
          {
            "name": "菜单",
            "sub_button": [
              {
                name: '百度搜索',
                type: 'view',
                url: 'https://www.baidu.com/'
              },
              {
                "type": "click",
                "name": "赞一下我们",
                "key": "V1001_GOOD"
              },
              {
                "type": "click",
                "name": "踩一下我们",
                "key": "V1002_NOT_GOOD"
              }
            ]
  
          },
          {
            "name": "发送位置",
            "type": "location_select",
            "key": "rselfmenu_2_0"
          }
        ]
      }
      wechatClient.haddle('createMenu', menu)
      // wechatClient.haddle('delMenu', menu)
    }
  } else if (message.MsgType === 'image') {
    ctx.replyData = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.replyData = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.replyData = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.replyData = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.replyData = [
      {
        title: message.Title,
        description: message.Description,
        picUrl: 'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=a60cbcc5094f78f0800b9df5410a6d68/00e93901213fb80e260d43463cd12f2eb8389446.jpg',
        url: message.Url
      }
    ]
  } else if (message.MsgType === 'event') {
    console.log(message.Event + '-----' + message.EventKey)
    ctx.replyData = message.Event + '-----' + message.EventKey
  }
}