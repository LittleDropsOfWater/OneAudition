<template>
  <div>
    <header class="header">
      <div class="avatar">
        <open-data class="avatar-origin" type="userAvatarUrl"></open-data>
      </div>
      <p class="nickname">
        <span v-show="phoneNumber">{{phoneNumber}}</span>
        <open-data v-show="!phoneNumber" type="userNickName"></open-data>
      </p>
    </header>
    <main>
      <div class="item" @click="bindViewTap('../list/main')">
        <i class="icon">
          <icon type="waiting" size="18" color="#3eaf7c" />
        </i>
        <span class="text">我的面试</span>
        <van-icon name="arrow" />
      </div>
      <section class="item" @click="callPhone">
        <i class="icon">
          <icon type="info" size="18" color="#3eaf7c" />
        </i>
        <span class="text">客服中心</span>
        <van-icon name="arrow" />
      </section>
     
      <div>
      <button open-type="openSetting" class="normal">打开设置页</button>
      </div>
    </main>
    <van-dialog
      id="van-dialog"
      use-slot
      :show="showPhoneDialog"
      confirmButtonOpenType="getPhoneNumber"
      :showConfirmButton="false"
      :showCancelButton="false"
      :closeOnClickOverlay="true"
      @opensetting="opensetting"
      @confirm="dialogConfirm"
    >
      <p style="padding:10px">为了更好的使用我们的服务,我们需要获取你的手机号码</p>
      <button open-type="getPhoneNumber" @getphonenumber="getphonenumber">确定</button>
    </van-dialog>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Dialog from "@/../static/vant/dialog/dialog";
import Toast from "@/../static/vant/toast/toast";
import fly from "@/utils/request";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      showPhoneDialog: false
    };
  },
  components: {},
  computed: {
    ...mapState({
      phoneNumber: state =>
        state.user.phoneNumber.replace(/^(\d{3})\d*(\d{4})$/g, "$1****$2")
    })
  },
  methods: {
    ...mapActions({
      getPhone: "user/getPhone"
    }),
    bindViewTap(url) {
      mpvue.navigateTo({ url });
    },
    callPhone() {
    },
    getphonenumber(e) {
      // console.log("getphonenumber", e);
      this.showPhoneDialog = false;

      if (e.target.errMsg !== "getPhoneNumber:fail use deny") {
        // 1.2.1 用户授权成功
        // 解密用户数据
        this.getPhone({
          encryptedData: e.target.encryptedData,
          iv: e.target.iv
        });
        Toast.success('绑定手机号成功')

      } else {
        // 1.2.2 用户授权失败
        wx.openSetting({
          success: result => {},
          fail: () => {},
          complete: () => {}
        });
      }
    },
    dialogConfirm() {
      this.showPhoneDialog = false;
    }
  },
  mounted() {
    const that = this;
    // 1,获取用户授权状态
    wx.getSetting({
      success: result => {
        // console.log("getSetting", result);
        // console.log("authSetting", result.authSetting);
        // console.log("scope.userInfo", result.authSetting["scope.userInfo"]);
        if (result.authSetting["scope.userInfo"]) {
          // 1.1 已授权,获取用户信息
          wx.getUserInfo({
            withCredentials: true,
            lang: "zh_CN",
            timeout: 10000,
            success: result => {
              // 1.1.1 调用api获取用户信息
              // console.log("getUserInfo:", result);
            }
          });
        } else {
          // 1.2 未授权,向用户申请获取权限
          if (!that.phoneNumber) {
            that.showPhoneDialog = true;
          }
        }
      }
    });
  }
};
</script>

<style lang='scss'>
.header {
  background-color: #f4f6f9;
  height: 250rpx;
  text-align: center;
  padding: 70rpx;
}
.avatar {
  width: 150rpx;
  height: 150rpx;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 auto;
  line-height: 150rpx;
  overflow: hidden;
  color: #3eaf7c;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .avatar-origin {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.nickname {
  margin: 50rpx 0;
}
.item {
  display: flex;
  align-items: center;
  padding: 40rpx;
  border-bottom: 1px solid #eee;
  color: #666;
}
.icon {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  margin-right: 50rpx;
}
.text {
  flex: 1;
}
.normal {
  margin-top: 40rpx;
  background-color: #3eaf7c;
  color:#fff;

}
</style>
