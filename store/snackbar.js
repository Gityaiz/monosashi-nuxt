export const state = () => ({
  isEnable: false,
  message: ''
})

export const getters = {
  status: state => {
    return state.isEnable
  },
  message: state => {
    return state.message
  }
}

export const mutations = {
  setenable (state) {
    state.isEnable = true
  },
  setdisable (state) {
    state.isEnable = false
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

