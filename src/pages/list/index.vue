<template>
  <div class="counter-warp">
    <div class="tabBar">
      <div
        v-for="(item,index) in tablist"
        :key="item.title"
        class="tabBarItem"
        :class="{active:listIndex===index}"
        @click="changeList(index,item.status)"
      >{{ item.title }}</div>
    </div>
    <div class="content">
      <div v-show="curlist.length>0">
        <div v-for="item in curlist" :key="item.id" class="list" @click="ToDetail(item.id)">
          <div class="double">
            <span class="text">{{ item.company }}</span>
            <span :class="statusTags[item.status]">{{status[item.status]}}</span>
          </div>
          <div class="address">{{item.address.address}}</div>
          <div class="double">
            <span class="time">面试时间:{{item.time}}</span>
            <span class="tag3" :class="item.remind?'tag3':'tag2'">{{ remind[item.remind] }}</span>
          </div>
        </div>
      </div>
      <div v-show="curlist.length===0">
        <p class="noData">当前分类还没有面试!</p>
      </div>
      <div v-show="!pullUpFlag&&curlist.length!==0">
        <p class="noMore">无更多数据</p>
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
// Use Vuex
import { formatTime } from "../../utils/index"; //格式化时间
import { mapState, mapActions, mapMutations } from "vuex";
import Toast from "@/../static/vant/toast/toast";

export default {
  data: {
    statusTags: {
      "-1": "tag1",
      "0": "tag2",
      "1": "tag3"
    }
  },
  computed: {
    ...mapState({
      list: state => state.index.list,
      listIndex: state => state.index.listIndex,
      tablist: state => state.index.tablist,
      status: state => state.index.status,
      remind: state => state.index.remind,
      pullUpFlag: state => state.index.pullUpFlag
    }),
    curlist() {
      const { tablist, listIndex, list } = this;
      return list.map(val => {
        return { ...val, time: formatTime(+val.start_time) };
      });
    }
  },
  methods: {
    ...mapActions({
      getDetail: "index/getDetail",
      getNewList: "index/getNewList",
      getMoreList: "index/getMoreList"
    }),
    ...mapMutations({
      updateCurInterview: "index/updateCurInterview"
    }),
    async changeList(index, status) {
      if (index === this.listIndex) {
        return;
      }
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
      await this.getNewList(index);
    },
    async ToDetail(id) {
      await this.getDetail(id);
      wx.navigateTo({
        url: "../detail/main"
      });
    }
  },
  async mounted() {
    const toast = Toast.loading({
      mask: true,
      duration: 0,
      forbidClick: true
    });
    await this.getNewList(this.listIndex);
    Toast.clear();
  },
  async onPullDownRefresh(e) {
    // console.log(e);
    // 下拉刷新
    const res = await this.getNewList(this.listIndex);
    // console.log(res);
    wx.stopPullDownRefresh();
  },
  onReachBottom(e) {
    // console.log("上拉加载", this.pullUpFlag);
    // 上拉加载
    if (!this.pullUpFlag) {
      return;
    }
    this.getMoreList(this.listIndex);
  }
};
</script>

<style lang='scss'>
.counter-warp {
  text-align: center;
}
.tabBar {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 90rpx;
  box-shadow: 0 1px 5px 0px #eee;

  .tabBarItem {
    padding: 10px 0;
    &.active {
      border-bottom: 1px solid #3eaf7c;
      color: #3eaf7c;
    }
  }
}
.content {
  padding-top: 90rpx;
  .noData {
    padding-top: 160rpx;
    font-size: 16px;
    color: #999;
  }
  .noMore {
    padding-top: 5rpx;
    padding-bottom: 20rpx;
    font-size: 14px;
    color: #999;
    &::after,
    &::before {
      content: "————————";
      padding: 0 5px;
    }
  }
  .list {
    padding: 10px;
    border-top: 10px solid #eee;
    font-size: 35rpx;

    .text {
      font-size: 44rpx;
      overflow: hidden;
      margin-right: 20rpx;
      text-overflow: ellipsis;
    }
    .address {
      font-size: 16px;
      color: #999;
      text-align: left;
    }
    .double {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      margin: 10rpx 0;
      .time {
        color: #666;
      }
      span:last-child {
        padding: 5rpx 10rpx;
      }
      .tag1,
      .tag2,
      .tag3 {
        flex-shrink: 0;
      }
      .tag1 {
        background-color: #eee;
        color: #999;
      }

      .tag2 {
        background-color: rgba(62, 175, 124, 0.089);
        color: #3eaf7c;
      }
      .tag3 {
        background-color: hsla(0, 87%, 69%, 0.1);
        color: #f56c6c;
      }
    }
  }
}
</style>
