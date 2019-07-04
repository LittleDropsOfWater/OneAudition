import { encryptedData, login, code2session } from "@/services";
import { getLocation } from "@/utils";
const state = {
  phoneNumber: "",
  longitude: 100,
  latitude: 23
};
const getters = {};
const actions = {
  async getLocation({ commit }, payload) {
    const res = await getLocation();
    console.log('getLocation',res);
    
    await commit("updateLocation", res);
    return res;
  },
  async getPhone({ commit }, payload) {
    const res = await encryptedData(payload);
    // console.log("getPhone", res.data.purePhoneNumber);
    await commit("updatePhoneNumber", res.data.purePhoneNumber);
  },
  async login({ commit }, payload) {
    const { code } = await login();
    const {data:{openid, phone}} = await code2session(code);
    if (!wx.getStorageSync("openid")) {
      wx.setStorageSync("openid", openid);
    }
    if (phone) {
      commit("updatePhoneNumber", phone);
    }
  }
};
const mutations = {
  updateLocation(state, payload) {
    state.longitude = payload.longitude;
    state.latitude = payload.latitude;
    // console.log("update", payload);
  },
  updatePhoneNumber(state, payload) {
    state.phoneNumber = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
