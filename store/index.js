export const state = () => ({
  email: {},
  loggedIn: false,
  fireid: {}
})

export const mutations = {
  setEmail (state, value) {
    state.email = value
  },
  setLoggedIn (state) {
    state.loggedIn = true
  },
  setLogOut (state) {
    state.loggedIn = false
    state.userid = ''
  },
  setFireID (state, value) {
    state.fireid = value
  }
}

export const getters = {
  email (state) {
    return state.email
  },
  isLoggedIn (state) {
    return state.loggedIn
  },
  fireid (state) {
    return state.fireid
  }
}

export const actions = {
  setEmail ({commit}, value) {
    commit('setEmail', {value})
  },
  setLoggedIn ({commit}) {
    commit('setLoggedIn')
  },
  setLogOut ({commit}) {
    commit('setLogOut')
  },
  setFireID ({commit}, value) {
    commit('setFireID', {value})
  }
}