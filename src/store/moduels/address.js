
const state={
  curAddress: {},
}
const getters={}
const actions={}
const mutations={
  updateCurAddress(state, payload) {
    state.curAddress = payload;
  },}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
