import * as types from './mutations_type'
import Services from './Services'
export default {
  // nuxt官网介绍nuxtServerInit
  // If the action nuxtServerInit is defined in the store, 
  // Nuxt.js will call it with the context (only from the server-side). 
  // It's useful when we have some data on the server we want to give directly to the client-side.
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.currentUser) {
      const { email, nickname, avatarUrl } = req.session.currentUser
      commit(types.SET_USER, {
        email,
        nickname,
        avatarUrl
      })
    }
  },
  getWechatSignature({ commit }, url) {
    try {
      console.log('--------dispatch --- getWechatSignature----------')
      return Services.getWechatSignature(url)
    } catch (error) {
      throw error
    }
  },
  getUserByOAuth({ commit }, url) {
    try {
      console.log('--------dispatch --- getUserByOAuth----------')
      return Services.getUserByOAuth(url)
    } catch (error) {
      throw error
    }
  },
  async getHousesData({ commit, state }, id = null) {
    try {
      console.log('--------action------getHousesData--------')
      // 获取数据
      const res = await Services.getHousesData(id)
      // 保存在state中
      if (id) {
        commit(types.SET_CURRENT_HOUSE, res.data.data)
      } else {
        commit(types.SET_HOUSES, res.data.data)
      }
      return res.data
    } catch (error) {
      throw error
    }
  },
  async getCharactersData({ commit, state }, id = null) {
    try {
      // 获取数据
      const res = await Services.getCharacterssData(id)
      // 保存在state中
      if (id) {
        commit(types.SET_CURRENT_CHARACTER, res.data.data)
      } else {
        commit(types.SET_CHARACTERS, res.data.data)
      }
      return res.data
    } catch (error) {
      throw error
    }
  },
  async getCitiseData({ commit, state }, id = null) {
    try {
      // 获取数据
      const res = await Services.getCitiesData(id)
      // 保存在state中
      commit(types.SET_CITIES, res.data.data)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async getProductsData({ commit, state }, id = null) {
    try {
      // 获取数据
      const res = await Services.getProductsData(id)
      // 保存在state中
      if (id) {
        commit(types.SET_CURRENT_PRODUCT, res.data.data)
      } else {
        commit(types.SET_PRODUCTS, res.data.data)
      }
      return res.data
    } catch (error) {
      throw error
    }
  },
  async postProductsData({ commit, state }, product) {
    try {
      // 获取数据
      const res = await Services.postProductsData(product)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async putProductsData({ commit, state }, product) {
    try {
      // 获取数据
      const res = await Services.putProductsData(product)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async delProductsData({ commit, state }, product) {
    try {
      // 获取数据
      const res = await Services.delProductsData(product)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async getUserData({ commit, state }, id = null) {
    try {
      // 获取数据
      const res = await Services.getUserData(id)
      // 保存在state中
      commit(types.SET_USER, res.data.data)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async login({ commit, state }, user) {
    // 校验参数
    if (!user || !user.email || !user.password) {
      return {
        success: false,
        err: 'user 参数缺少'
      }
    }
    try {
      // login api
      const res = await Services.login(user)
      // 校验
      if (res.data.success || res.data.success === true) {
        // 保存 user 到 state
        commit(types.SET_USER, res.data.data)
      }
      return res.data
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('来错地方了')
      }
    }
  }
}