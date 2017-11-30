export default function({ store, redirect }) {
  // 如果没有登录,则重定向到登录页面
  if (!store.state.user || !store.state.user.email) {
    redirect('/login')
  }
}