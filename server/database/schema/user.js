import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10 // 加盐安全级别
const MAX_LOGIN_ATTEMPTS = 5 // 最大错误登录尝试次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 禁止登录锁定时间

const UserSchema = new Schema({
  role: { // 角色: user admin superadmin
    type: String,
    default: 'user'
  },
  openid: [String], // 小程序,微信各自的openid
  unionid: String, // 微信开放平台的唯一id
  nickname: String, 
  address: String,
  province: String,
  country: String,
  city: String,
  sex: String,
  email: String,
  headimgurl: String,
  avatarUrl: String,
  password: String, // 加密前?
  hashed_password: String, // 加密后的密码?
  loginAttempts: { // 登录尝试的次数
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number, // 锁定时间
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
// 密码加盐加密
UserSchema.pre('save', function (next) {
  let preSaveUser = this
  // 判断当前操作是否有操作密码
  if (!preSaveUser.isModified('password')) {
    return next()
  }
  // bcrypt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    // 拿到加密前的密码
    bcrypt.hash(preSaveUser.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      // 保存
      console.log('加盐后的密码保存---' + hash)
      preSaveUser.password = hash // TODO:是否区分2个密码字段
      preSaveUser.hashed_password = hash
      next()
    })
  })
})
// 虚拟字段
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// 实例方法
UserSchema.methods = {
  // 比较密码
  comparePassword: function(oldPassword, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, oldPassword, (err, isMatch) => {
        if (err) {
          reject(err)
        } else {
          resolve(isMatch)
        }
      })
    })
  },
  // 自增登录尝试次数
  incLoginAttempts: function(user) {
    const preIncUser = this
    return new Promise((resolve, reject) => {
      // 判断是否在锁定状态
      if (preIncUser.lockUntil && preIncUser.lockUntil < Date.now()) {
        // 锁定状态,当时已经解锁
        preIncUser.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, function(err) {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      } else {
        // 非锁定状态
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        if (preIncUser.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !preIncUser.isLocked) {
          // 进行锁定
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        preIncUser.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}
const User = mongoose.model('User', UserSchema)