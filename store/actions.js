import Services from './Services'
export default {
  getWechatSignature({ commit }, url) {
    console.log('--------dispatch --- getWechatSignature----------')
    return Services.getWechatSignature(url)
  }
}