
export const strict = false

// stateはfunction形式で記述しないと複数人で同じ値になってしまう場合がある
export const state = () => ({
  topic: {},
})

export const getters = {
  topic: state => {
    return state.topic
  },
}

export const mutations = {
  setTopic (state, value) {
    state.topic = value
  },
}

export const actions = {
  setTopic ({commit}, value) {
    commit('setTopic', value)
  },
}

