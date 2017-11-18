import * as types from './mutations_type'
import Services from './Services'
export default {
  getWechatSignature({ commit }, url) {
    console.log('--------dispatch --- getWechatSignature----------')
    return Services.getWechatSignature(url)
  },
  getUserByOAuth({ commit }, url) {
    console.log('--------dispatch --- getUserByOAuth----------')
    return Services.getUserByOAuth(url)
  },
  async getHousesData({ commit, state }, id = null) {
    console.log('--------action------getHousesData--------')
    // 获取数据
    const res = await Services.getHousesData(id)
    // 保存在state中
    if (id) {
      commit(types.SET_CURRENT_HOUSE, res.data.data)
    } else {
      commit(types.SET_HOUSES, res.data.data)
    }
    console.log(res.data)
    return res.data
  },
  async getCharactersData({ commit, state }, id = null) {
    // 获取数据
    const res = await Services.getCharacterssData(id)
    // 保存在state中
    if (id) {
      commit(types.SET_CURRENT_CHARACTER, res.data.data)
    } else {
      commit(types.SET_CHARACTERS, res.data.data)
    }
    console.log(res.data)
    return res.data
  },
  async getCitiseData({ commit, state }, id = null) {
    // 获取数据
    const res = await Services.getCitiesData(id)
    // 保存在state中
    commit(types.SET_CITIES, res.data.data)
    console.log(res.data)
    return res.data
  },
  async getProductsData({ commit, state }, id = null) {
    // 获取数据
    const res = await Services.getProductsData(id)
    // 保存在state中
    if (id) {
      commit(types.SET_CURRENT_PRODUCT, res.data.data)
    } else {
      commit(types.SET_PRODUCTS, res.data.data)
    }
    console.log(res.data)
    return res.data
  },
  async getUserData({ commit, state }, id = null) {
    // 获取数据
    const res = await Services.getUserData(id)
    // 保存在state中
    commit(types.SET_USER, res.data.data)
    console.log(res.data)
    return res.data
  }
}