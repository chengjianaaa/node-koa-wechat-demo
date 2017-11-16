// import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
// import state from './state'

// Vue.use(Vuex)

// export default new Vuex.Store({
//   actions,
//   getters,
//   mutations,
//   state,
//   strict: true
// })

const createStore = () => {
  return new Vuex.Store({
    state: {
      imageCDN: '你的七牛 CDN',
      homePageScroll: {
        'home': 0,
        'house': 0
      },
      APICharacters: null,
      IMDb: null,
      authUser: null,
      shoppingScroll: 0,
      houses: [],
      characters: [],
      focusHouse: {},
      focusCharacter: {},
      user: null,
      products: [],
      focusProduct: {},
      payments: []
    },
    getters,
    actions,
    mutations
  })
}

export default createStore