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
    let url = `${baseApiUrl}/api/product`
    if (id) {
      url = `${url}/${id}`
    }
    console.log('--------getProductseData-------url-----' + url)
    // 异步请求数据
    const data = await axios.get(url)
    // 返回数据
    return data
  }
  async postProductsData(product) {
    // 组装好url
    let url = `${baseApiUrl}/api/product`
    if (!product) {
      console.log('上传 的product 为空')
      return 
    }
    console.log('--------postProductsData-------url-----' + url)
    // 异步请求数据
    const data = await axios.post(url, product)
    // 返回数据
    return data
  }
  async putProductsData(product) {
    // 组装好url
    let url = `${baseApiUrl}/api/product`
    if (!product) {
      console.log('待更新更新 的product 为空')
      return 
    }
    console.log('--------putProductsData-------url-----' + url)
    // 异步请求数据
    const data = await axios.put(url, product)
    // 返回数据
    return data
  }
  async delProductsData(product) {
    // 组装好url
    if (!product || !product._id) {
      console.log('待删除 的product 为空')
      return 
    }
    let url = `${baseApiUrl}/api/product/${product._id}`
    console.log('--------delProductsData-------url-----' + url)
    // 异步请求数据
    const data = await axios.delete(url, product)
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