<template>
  <div class="wrap">
    <div class="inputRow">
      <span>面试地址：</span>
      <span>{{curInterview.address.address}}</span>
    </div>
    <div class="inputRow">
      <span>面试时间：</span>
      <span>{{InterviewTime}}</span>
    </div>
    <div class="inputRow">
      <span>联系方式：</span>
      <span>{{curInterview.phone}}</span>
    </div>
    <div class="inputRow">
      <span>是否提醒：</span>
      <span>{{remind[curInterview.remind]}}</span>
    </div>
    <div class="inputRow">
      <span>面试状态：</span>
      <span>{{InterviewStatus}}</span>
    </div>
    <div v-show="curInterview.status===-1">
      <div class="inputRow">
        <span>取消提醒：</span>
        <van-switch
          :checked="curInterview.remind==1"
          @change="switchChange"
          active-color="#3eaf7c"
        />
      </div>
      <div class="action">
        <van-button
          type="info"
          size="large"
          class="button"
          @click="ClockOn"
          :disabled="hadClocked"
        >{{hadClocked?'已打卡':'去打卡'}}</van-button>
        <van-button type="danger" size="large" class="button" @click="giveUp">放弃面试</van-button>
      </div>
    </div>
    <van-dialog id="van-dialog" class="dialog" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { formatTime } from "@/utils/";
import Dialog from "@/../static/vant/dialog/dialog";

export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      curInterview: state => state.index.curInterview,
      tablist: state => state.index.tablist,
      remind: state => state.index.remind,
      listIndex: state => state.index.listIndex,
      hadClocked: state => state.index.curInterview.status === 0,
    }),
    InterviewTime() {
      return formatTime(+this.curInterview.start_time);
    },
    InterviewStatus() {
      return this.tablist.find(val => val.status === this.curInterview.status)
        .title;
    }
  },
  methods: {
    ...mapActions({
      updateDetail: "index/updateDetail",
      getNewList: "index/getNewList"
    }),
    ...mapMutations({}),
    switchChange(e) {
      this.updateDetail({
        remind: this.curInterview.remind === 1 ? -1 : 1
      });
      // this.checked=!this.checked;
    },
    async giveUp() {
      const res = await Dialog.confirm({
        title: "温馨提示",
        message: "确定要放弃本次面试吗?"
      });
      console.log(res);
      this.updateDetail({
        status: 1
      });
    },
    ClockOn() {
      if (this.hadClocked) {
        return;
      }
      wx.navigateTo({
        url: "../clockOn/main"
      });
    }
  },
  created() {},
  mounted() {
    wx.setNavigationBarTitle({
      title: this.curInterview.company
    });
    console.log(this.tablist);
  },

  onUnload() {
    this.getNewList(this.listIndex);
  }
};
</script>
<style scoped lang="scss">
.wrap {
  border-top: 1px solid #eee;
  .inputRow {
    display: flex;
    padding: 20rpx;
    border-bottom: 1px solid #eee;
    color: #333;
    font-size: 30rpx;

    & span:first-child {
      width: 170rpx;
      color: #666;
      flex-shrink: 0;
      display: inline-block;
    }
  }
}
.action {
  display: flex;
  margin: 50rpx 15rpx;
  .button {
    flex: 1;
    padding: 10rpx;
  }
}
.dialog {
  font-size: 106px;
}
</style>