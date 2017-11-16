import * as types from './mutations_type'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations