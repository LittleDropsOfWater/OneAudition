<template>
  <div class="container">
    <map
      id="map"
      :longitude="from.longitude"
      :latitude="from.latitude"
      :polyline="polyline"
      :circles="circles"
      :markers="markers"
      scale="14"
      subkey="X7RBZ-MMOKR-UQEWJ-WSCXC-IVXVK-IFFLL"
      show-location
      class="map"
    >
      <cover-view class="locate">
        <cover-image @click="tryGetLocation" src="/static/images/location.png"></cover-image>
      </cover-view>
    </map>
    <button class="add" @click="clockin">去打卡</button>
    <van-toast id="van-toast" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import QQMapWX from "@/utils/qqmap";
import Toast from "@/../static/vant/toast/toast";
export default {
  props: {},
  components: {},
  data() {
    return {
      colddown: true
    };
  },
  computed: {
    ...mapState({
      curInterview: state => state.index.curInterview,
      from: state => {
        console.log("mapstate from", state.user);
        return {
          longitude: state.user.longitude,
          latitude: state.user.latitude
        };
      }
    }),
    to: state => {
      return {
        longitude: state.curInterview.longitude,
        latitude: state.curInterview.latitude
      };
    },
    circles(state) {
      console.log("to", state.to);
      console.log("from", state.from);
      return [
        {
          ...state.to,
          radius: 1000,
          strokeWidth: 4,
          color: "#7cb5ecaa",
          fillColor: "#7cb5ec88"
        }
      ];
    },
    markers(state) {
      return [
        {
          ...state.to,
          iconPath: "/static/images/logo.png",
          id: 0,
          width: 30,
          height: 30,
          title: state.curInterview.company,
          callout: {
            content: state.curInterview.company,
            padding: 5
          }
        }
      ];
    },
    polyline({ from, to }) {
      return [
        {
          points: [from, to],
          color: "#ff9900",
          width: 1,
          borderColor: "#ffcc00",
          borderWidth: 2,
          dottedLine: true
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      updateDetail: "index/updateDetail",
      getLocation: "user/getLocation"
    }),
    async clockin() {
      console.log("clockin");
      console.log("from", this.from);
      console.log("to", this.to);
      const { from, to } = this,
        that = this;
      this.qqmapsdk.calculateDistance({
        from,
        to: [to],
        success(res, data) {
          console.log("res", res);
          console.log("data", data);
          console.log("距离目标", ~~data.distance[0] / 1000, "公里");
          let distance = ~~data.distance[0] / 1000;
          if (distance > 1) {
            Toast(`距离目的地${distance}公里,还不能打卡`);
          } else {
            that.updateDetail({ status: 0, sign_time: +new Date() });
            Toast(`打卡成功`);
            wx.navigateBack({ delta: 1 });
          }
        }
      });
    },
    async tryGetLocation() {
      if (!this.colddown) {
        return;
      }
      this.colddown = false;
      const res = await this.getLocation();
      this.colddown = true;
    }
  },
  created() {
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: "X7RBZ-MMOKR-UQEWJ-WSCXC-IVXVK-IFFLL"
    });
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: `打卡:${this.curInterview.company}`
    });
    console.log("curInterview", this.curInterview);
  },
  destroyed() {
    console.log("destoryed");
  }
};
</script>
<style scoped lang="scss">
.map {
  width: 100%;
  flex: 1;
}
.locate {
  position: fixed;
  bottom: 170rpx;
  left: 30rpx;
  width: 100rpx;
  height: 100rpx;
}
.my {
  position: fixed;
  bottom: 170rpx;
  right: 30rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}
.add {
  flex-shrink: 0;
  width: 100%;
  height: 100rpx;
  background-color: #3eaf7c;
  color: #fff;
  text-align: center;
  font-size: 40rpx;
}
</style>