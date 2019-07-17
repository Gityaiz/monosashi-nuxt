// stateはfunction形式で記述しないと複数人で同じ値になってしまう場合がある
export const state = () => ({
  email: {},
  fireid: {}
})

export const getters = {
  email: state => {
    return state.email
  },
  fireid: state => {
    return state.fireid
  }
}

export const mutations = {
  setEmail (state, value) {
    state.email = value
  },
  setLogOut (state) {
    state.email = ''
  },
  setFireID (state, value) {
    state.fireid = value
  }
}

export const actions = {
  setEmail ({commit}, value) {
    commit('setEmail', value)
  },
  setLogOut ({commit}) {
    commit('setLogOut')
  },
  setFireID ({commit}, value) {
    commit('setFireID', value)
  }
}

