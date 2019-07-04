import { getList, addInterview, getDetail, updateDetail } from "@/services";
//原始数据
const state = {
  tablist: [
    {
      title: "未开始",
      status: -1
    },
    {
      title: "已打卡",
      status: 0
    },
    {
      title: "已放弃",
      status: 1
    },
    {
      title: "全部"
    }
  ],
  remind: {
    "-1": "未提醒",
    "0": "已提醒",
    "1": "未提醒"
  },
  status: {
    "-1": "未开始",
    "0": "已打卡",
    "1": "已放弃"
  },
  list: [],
  listIndex: 0,
  curInterview: {},
  page: 1,
  pageSize: 10,
  pullUpFlag: true
};

// 派生数据
const getters = {};
// 异步改变
const actions = {
  async getList({ commit, state }, payload) {
    let params = { pageSize: state.pageSize, page: state.page },
      status = state.tablist[payload].status;
    if (typeof status !== "undefined") {
      params.status = status;
    }
    const res = await getList(params);
    return res;
  },
  // 获取新面试列表
  async getNewList({ commit, dispatch, state }, payload) {
    await commit("changeIndex", payload);
    const res = await dispatch("getList", payload);
    await commit("updateList", res.data);
    return res;
  },
  //追加面试列表 
  async getMoreList({ state, commit, dispatch }, payload) {
    if (!state.pullUpFlag) {
      return;
    }
    await commit("addPage");
    const res = await dispatch("getList", state.listIndex);
    await commit("appendList", res.data);
    return res;
  },
  // 添加面试
  async addList({ commit }, payload) {
    // console.log("addList.payload", payload);
    const res = await addInterview(payload);
    // console.log("addList.res", res);
    // 返回Promise
    return res;
  },
  //获取面试详情
  async getDetail({ commit }, payload) {
    const { data } = await getDetail(payload);
    data.address = JSON.parse(data.address);
    await commit("updateCurInterview", data);
  },
  // 更新面试信息
  async updateDetail({ commit, dispatch, state }, payload) {
    const res = await updateDetail(state.curInterview.id, payload);
    console.log('updateDetail',res);
    await dispatch("getDetail", state.curInterview.id);
    await dispatch("getNewList",state.listIndex)
  }
};
// 同步改变,改变数据的唯一方法
const mutations = {
  updateList(state, payload) {
    state.list = payload.map(val => ({
      ...val,
      address: JSON.parse(val.address)
    }));
    if (payload.length < 10) {
      state.pullUpFlag = false;
    }
  },
  appendList(state, payload) {
    if (!payload.length) {
      state.pullUpFlag = false;
    }
    state.list = [
      ...state.list,
      ...payload.map(val => ({
        ...val,
        address: JSON.parse(val.address)
      }))
    ];
    if (res.data.length === 0) {
      state.page -= 1;
    }
  },
  updateMarkers(state, payload) {
    state.markers = payload;
  },
  updateCurInterview(state, payload) {
    state.curInterview = payload;
    
  },
  addPage(state) {
    state.page += 1;
  },
  delPage(state) {
    state.page -= 1;
  },
  resetPage(state) {
    state.page = 1;
  },
  changeIndex(state, payload) {
    state.listIndex = payload;
    state.page = 1;
    state.pullUpFlag = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
