import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

const debug = process.env.NODE_ENV !== 'production'
const createStore = () => {
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    // strict: true,
    plugins: debug ? [createLogger()] : []
  })
}

export default createStore