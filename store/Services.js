import axios from 'axios'

const baseUrl = ''

class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
  getUserByOAuth(url) {
    console.log('------services ---- getUserByOAuth----url---' + `${baseUrl}/wechat-oauth?url=${url}`)
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }
}
export default new Services()