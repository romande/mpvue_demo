const mpdata = {
    state: {
      pageX: 0,
      pageY: 0
    },
    mutations: {
      SET_PAGE_X_Y: (pageX, pageY) => {
        state.pageX = pageX
        state.pageY = pageY
      }
    },
    actions: {
      SET_PAGE_X_Y({ commit }, pageX, pageY) {
        commit('SET_PAGE_X_Y', pageX, pageY)
      }
    }
  }
  
  export default mpdata
  