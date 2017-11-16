import Services from './Services'
export default {
  getWechatSignature({ commit }, url) {
    console.log('--------dispatch --- getWechatSignature----------')
    return Services.getWechatSignature(url)
  },
  getUserByOAuth({ commit }, url) {
    console.log('--------dispatch --- getUserByOAuth----------')
    return Services.getUserByOAuth(url)
  }
}