import xss from 'xss'
import R from 'ramda'
import { controller, get, post, put } from '../decorator/router'
import api from '../api'

const ROLE_ADMIN = 'admin'

@controller('/admin')
export class adminController {
  @post('/login')
  async login(ctx, next) {
    // 获取上传的表单参数
    let { email, password } = ctx.request.body
    // 校验
    if (!email || !password) {
      console.log('login上传email/password的不存在')
      return ctx.apiError('邮箱/密码请填写完整')
    }
    // 校验xss
    try {
      // 查询数据库
      const { user, isMatch } = await api.admin.login(email, password)
      // 判断是登录成功
      if (isMatch) {
        // 判断是否管理员
        if (user.role !== ROLE_ADMIN) {
          return ctx.apiError('你不是管理员,没权限登录该网站后台')
        }
        // 保存会话
        ctx.session.currentUser = user
        // 返回登录信息数据
        return ctx.apiSuccess({
          email: user.email,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl
        })
      } else {
        // 登录失败
        if (!user) return ctx.apiError('邮箱不存在,登录失败')
        return ctx.apiError('密码错误,登录失败')
      }
    } catch (error) {
      console.log('controller---admin---login---失败')
      ctx.apiError(error)
    }
  }
} 