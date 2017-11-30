export default {
  db: 'mongodb://localhost/iceAndFire', // mongo地址
  site_root_url: 'http://ssr.hk1.mofasuidao.cn', // 项目域名
  qiniu_accessKey: '你的七牛accessKey', // TODO 上传github时注意删除
  qiniu_secretKey: '你的七牛secretKey', // TODO 上传github时注意删除
  admin_email: 'admin@admin.com', // 默认管理员邮箱(帐号)
  admin_password: 'admin', // 默认管理员密码 
  wechat: {
    appID: 'wx0d95ddaac2cd9285', // 测试公众号
    appSecret: 'b7e871670d6997a887736f976d52e717', // 测试公众号
    token: 'hellowechat'
  }
}