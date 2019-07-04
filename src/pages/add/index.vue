<template>
  <div class="counter-warp">
    <h2 class="title">面试信息</h2>
    <form report-submit="true" @submit="submit" report-submit-timeout="1000">
      <div class="inputRow">
        <span>公司名称</span>
        <input placeholder="请输入公司名称" type="text" class="input" v-model="company" />
      </div>
      <div class="inputRow">
        <span>公司电话</span>
        <input placeholder="请输入面试联系人电话" type="number" maxlength="11" class="input" v-model="phone" />
      </div>
      <div class="inputRow">
        <span>面试时间</span>
        <picker
          mode="multiSelector"
          class="input"
          :value="multiIndex"
          :range="newMultiArray"
          @change="bindMultiPickerChange"
          @columnchange="columnchange"
        >
          <span>{{time}}</span>
        </picker>
        <icon type="warn" size="30" color="orange" @click="showToast" />
      </div>
      <div class="inputRow">
        <span>面试地址</span>
        <input
          type="date"
          placeholder="请选择面试地址"
          disabled
          class="input"
          @click="goToAddress"
          :value="address"
        />
      </div>
      <h2 class="title">备注信息</h2>
      <div class="textareaWrap">
        <textarea class="textarea" v-model="description" placeholder="备注信息(可选,100个字以内)"></textarea>
      </div>
      <button class="submit" form-type="submit" :disabled="!canSubmit">确认</button>
    </form>

    <mptoast />
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import mptoast from "mptoast";
import Dialog from "@/../static/vant/dialog/dialog";
import Toast from "@/../static/vant/toast/toast";
import moment from "moment";
export default {
  components: { mptoast },
  data() {
    return {
      clickable: true,
      company: "",
      phone: "",
      description: "",
      time: "2019-07-01 14:00",
      multiArray: [],
      multiIndex: [0, 0, 0, 0],
      year: "",
      month: "",
      day: "",
      hour: ""
    };
  },
  computed: {
    ...mapState({
      curAddress: state => state.address.curAddress
    }),
    address() {
      return this.curAddress.address || "";
    },
    newMultiArray() {
      let array = [];
      const date = new Date();
      const months = [];
      const days = [];
      const hours = [];
      const minutes = [];
      let minhour =
        this.multiIndex[0] === 0 && this.multiIndex[1] === 0 ? this.hour : 0;
      let minDay = this.multiIndex[0] === 0 ? this.day : 1;
      if (minhour === 23) {
        minhour = 0;
        minDay = this.day + 1;
      }
      for (let i = date.getMonth() + 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        months.push("" + i + "月");
      }
      array.push(months);
      for (let i = minDay; i <= 31; i++) {
        if (i < 10) {
          i = i;
        }
        days.push("" + i + "号");
      }
      array.push(days);
      for (let i = minhour; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        hours.push("" + i + "点");
      }
      array.push(hours);
      for (let i = 0; i < 6; i++) {
        minutes.push(`${i * 10 || "00"}分`);
      }
      array.push(minutes);
      return array;
    },
    canSubmit() {
      return (
        this.clickable &&
        this.company &&
        /^1\d{10}$/.test(this.phone) &&
        this.time &&
        this.address
      );
    }
  },
  methods: {
    ...mapActions({
      addList: "index/addList"
    }),
    columnchange(e) {
      // console.log(e.mp.detail);
      const { column, value } = e.mp.detail;
      const oldLength = this.newMultiArray[2].length;
      this.$set(this.multiIndex, column, value);
      const newLength = this.newMultiArray[2].length;
      if (newLength !== oldLength) {
        this.$set(
          this.multiIndex,
          2,
          newLength - oldLength + this.multiIndex[2]
        );
      }
    },
    //获取时间日期
    bindMultiPickerChange(e) {
      if (e) {
        this.multiIndex = e.target.value;
      }
      // console.log("当前选择的时间", this.multiIndex);
      const index = this.multiIndex;
      const year = this.year;
      const month = this.newMultiArray[0][index[0]];
      const day = this.newMultiArray[1][index[1]];
      const hour = this.newMultiArray[2][index[2]];
      const minute = this.newMultiArray[3][index[3]];
      this.time =
        year +
        "-" +
        month.slice(0, -1).padStart(2, 0) +
        "-" +
        day.slice(0, -1).padStart(2, 0) +
        " " +
        hour.slice(0, -1) +
        ":" +
        minute.slice(0, -1);
    },
    async submit(e) {
      // console.log("submit", e);
      if(this.clickable===false){
        return ;
      }
      this.clickable = false;
      var obj = {
        company: this.company, //公司名
        phone: this.phone, //手机号
        form_id: e.target.formId, //form_id
        address: JSON.stringify(this.curAddress), //面试地址stringify后的字符串
        longitude: this.curAddress.longitude, //纬度
        latitude: this.curAddress.latitude, //经度
        start_time: +new Date(this.time), //开始时间
        description: this.description //面试备注
      };
      let data = await this.addList(obj);
      // console.log("addList.data:", data);
      if (data.code == 0) {
        await Dialog.alert({
          title: "温馨提示",
          message: "添加面试成功"
        });
        mpvue.navigateTo({ url: "../list/main" });
      } else {
        await 
Toast.fail('添加面试失败');
      }
      this.clickable = true;
    },
    goToAddress() {
      mpvue.navigateTo({ url: "../address/main" });
    },
    showToast() {
      this.$mptoast("在面试前一个小时我们会提醒你哦");
    }
  },
  mounted() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.day = today.getDate();
    this.hour = today.getHours() + 1;
    // console.log("today", today);
    this.bindMultiPickerChange();
  }
};
</script>

<style>
.inputRow {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 30rpx;
}
.inputRow > span:first-child {
  margin-right: 30px;
}
.inputRow > *:nth-child(2) {
  flex: 1;
}
.title {
  background-color: #43db97;
  padding: 10px 20px;
  font-size: 40rpx;
  color: #fff;
}
.input {
  flex: 1;
}
.textareaWrap {
  padding: 20rpx;
}
.textarea {
  border: 1px solid #3eaf7c;
  width: 100%;
  padding: 10px;
  margin: 10rpx auto;
  box-sizing: border-box;
  font-size: 30rpx;
}
.submit {
  background-color: #3eaf7c;
  color: #fff;
  margin-top: 40rpx;
}
</style>
