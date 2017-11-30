import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function login(email, password) {
  let isMatch = false
  try {
    const user = await User.findOne({ email: email }).exec()
    if (user) {
      console.log('正在比对帐号/密码中......')
      isMatch = await user.comparePassword(user.password, password)
      console.log('比对结果......' + isMatch)
    }
    return {
      isMatch,
      user
    }
  } catch (error) {
    throw error
  }
}
