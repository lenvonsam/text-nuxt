import Vuex from 'vuex'
import state from './state'
import user from './modules/user'

const store = () => {
  return new Vuex.Store({
    state,
    actions: {
      configVal ({commit}, {key, val}) {
        commit('CONFIGVAL', {key: key, val: val})
      },
      setSearchParams ({commit}, searchParamsObj) {
        commit('SETSEARCHPARAMS', searchParamsObj)
      },
      clearSearchParams ({commit}) {
        commit('CLEARSEARCHPARAMS')
      }
    },
    mutations: {
      CONFIGVAL (state, {key, val}) {
        state[key] = val
      },
      SETSEARCHPARAMS (state, searchParamsObj) {
        state.searchParams = searchParamsObj
      },
      CLEARSEARCHPARAMS (state) {
        state.searchParams = {}
      }
    },
    modules: {
      user
    }
  })
}
export default store
