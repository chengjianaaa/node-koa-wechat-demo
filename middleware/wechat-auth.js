export default function ({ store, redirect, route }) {
  // 判断是否已经经过授权
  if (!store.state.authUser) {
    // 获取跳转前的url
    let { fullPath } = route
    fullPath = encodeURIComponent(fullPath.substr(1))
    // 跳转到微信授权网页
    // 拿到微信用户信息
    return redirect(`/wechat-redirect?visit=${fullPath}`)
  }
  // 放行
}