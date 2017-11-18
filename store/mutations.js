import * as types from './mutations_type'

const mutations = {
  [types.SET_HOUSES](state, houses) {
    state.houses = houses
  },
  [types.SET_CHARACTERS](state, characters) {
    state.characters = characters
  },
  [types.SET_CITIES](state, cities) {
    state.cities = cities
  },
  [types.SET_CURRENT_HOUSE](state, currentHouse) {
    state.currentHouse = currentHouse
  },
  [types.SET_CURRENT_CHARACTER](state, currentCharacter) {
    state.currentCharacter = currentCharacter
  },
  [types.SET_PRODUCTS](state, products) {
    state.products = products
  },
  [types.SET_CURRENT_PRODUCT](state, currentProduct) {
    state.currentProduct = currentProduct
  },
  [types.SET_USER](state, user) {
    state.user = user
  }
}

export default mutations