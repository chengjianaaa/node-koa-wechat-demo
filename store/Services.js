import axios from 'axios'

const baseUrl = ''
// const baseApiUrl = 'http://rapapi.org/mockjsdata/29243'
const baseApiUrl = 'http://localhost:3000'
class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
  getUserByOAuth(url) {
    console.log('------services ---- getUserByOAuth----url---' + `${baseUrl}/wechat-oauth?url=${url}`)
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }
  async getHousesData(id = null) {
    // 组装好url
    let url = `${baseApiUrl}/wiki/house`
    if (id) {
      url = `${url}/${id}`
    }
    console.log('--------getHousesData-------url-----' + url)
    // 异步请求数据
    const data = await axios.get(url)
    // 返回数据
    return data
  }
  async getCharacterssData(id = null) {
    // 组装好url
    let url = `${baseApiUrl}/wiki/character`
    if (id) {
      url = `${url}/${id}`
    }
    console.log('--------getCharacterssData-------url----' + url)
    // 异步请求数据
    const data = await axios.get(url)
    // 返回数据
    return data
  }
  async getCitiesData(id = null) {
    // 组装好url
    let url = `${baseApiUrl}/wiki/city`
    if (id) {
      url = `${url}/${id}`
    }
    console.log('--------getCitiesData-------url-----' + url)
    // 异步请求数据
    const data = await axios.get(url)
    // 返回数据
    return data
  }
  async getProductsData(id = null) {
    // 组装好url
    let url = `${baseApiUrl}/wiki/product`
    if (id) {
      url = `${url}/${id}`
    }
    console.log('--------getProductseData-------url-----' + url)
    // 异步请求数据
    const data = await axios.get(url)
    // 返回数据
    return data
  }
  async getUserData(id = null) {
    // 组装好url
    let url = `${baseApiUrl}/api/user`
    if (id) {
      url = `${url}/${id}`
    }
    console.log('--------getUserData-------url-----' + url)
    // 异步请求数据
    const data = await axios.get(url)
    // 返回数据
    return data
  }
}
export default new Services()