export const state = () => ({
  status: false,
  message: ''
})

export const getters = {
  status: state => {
    return state.status
  },
  message: state => {
    return state.message
  }
}

export const mutations = {
  setenable (state) {
    state.status = true
  },
  setdisable (state) {
    state.status = false
  },
  setMessage (state, message) {
    state.message = message
  }
}

export const actions = {
  snackOn ({commit}) {
    commit('setenable')
  },
  snackOff ({commit}) {
    commit('setdisable')
  },
  setMessage ({commit}, message) {
    commit('setMessage', message)
  }
}

