
export const strict = false

// stateはfunction形式で記述しないと複数人で同じ値になってしまう場合がある
export const state = () => ({
  name: {},
  email: {},
  fireid: {},
  profileImageUrl: {},
})

export const getters = {
  name: state => {
    return state.name
  },
  email: state => {
    return state.email
  },
  fireid: state => {
    return state.fireid
  },
  profileImage: state => {
    return state.profileImageUrl
  }
}

export const mutations = {
  setName (state, value) {
    state.name = value
  },
  setEmail (state, value) {
    state.email = value
  },
  setLogOut (state) {
    state.name = ''
    state.email = ''
    state.fireid = ''
    state.profileImageUrl = ''

  },
  setFireID (state, value) {
    state.fireid = value
  },
  setProfileImageUrl (state, value) {
    state.profileImageUrl = value
  },

  initializeState (state, value) {

  }

}

export const actions = {
  setName ({commit}, value) {
    commit('setName', value)
  },
  setEmail ({commit}, value) {
    commit('setEmail', value)
  },
  setLogOut ({commit}) {
    commit('setLogOut')
  },
  setFireID ({commit}, value) {
    commit('setFireID', value)
  },
  setProfileImageUrl ({commit}, value) {
    commit('setProfileImageUrl', value)
  }
}

