import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ACCESS_TOKEN = 'access_token'
const TokenSchema = new Schema({
  name: String, // 名字
  access_token: String, // access_token 票据
  expires_in: Number, // 过期时间
  meta: {
    createAt: { // 创建时间
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date, // 修改时间
      default: Date.now()
    }
  }
})

TokenSchema.pre('save', function(next) {
  if (this.isNew) { // TODO 箭头函数能用吗? this? => 不能 如果该回调是箭头函数 this指向全局(因为是参考的是词法作用域)
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.updateAt = Date.now()
  }
  next()
})

TokenSchema.statics = {
  async getAccessToken() {
    const token = await this.findOne({name: ACCESS_TOKEN}).exec()
    if (token && token.token) {
      token.access_token = token.token
    }
    return token
  },
  async saveAccessToken(data) {
    console.log('----保存前的saveAccessToken---')
    let token = await this.findOne({ name: ACCESS_TOKEN }).exec()
    if (token) {
      // 更新token
      token.access_token = data.access_token
      token.expires_in = data.expires_in
    } else {
      // 创建token
      token = new Token({
        name: ACCESS_TOKEN,
        access_token: data.access_token,
        expires_in: data.expires_in
      })
    }

    try {
      await token.save()
    } catch (error) {
      console.log(error)
    }

    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
