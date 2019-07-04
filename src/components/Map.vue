<template>
  <div class="container">
    <map
      id="map"
      :longitude="longitude"
      :latitude="latitude"
      :polyline="polyline"
      :circles="circles"
      :markers="markers"
      scale="14"
      subkey="X7RBZ-MMOKR-UQEWJ-WSCXC-IVXVK-IFFLL"
      show-location
      class="map"
    >
      <cover-view>
        <cover-view class="locate">
          <cover-image @click="tryGetLocation" src="/static/images/location.png"></cover-image>
        </cover-view>
        <cover-view class="my">
          <cover-image v-show="showMine" @click="TapToMine" src="/static/images/my.png"></cover-image>
        </cover-view>
        <cover-view></cover-view>
      </cover-view>
    </map>
    <button class="add" @click="buttonClick">{{buttonTitle}}</button>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    buttonClick: Function,
    buttonTitle: String,
    showMine: {
      type:Boolean,
      default:false,
    },
    circles: Array,
    polyline: Array,
    markers: Array
  },
  components: {},
  data() {
    return {
      colddown: true
    };
  },
  computed: {
    ...mapState({
      longitude: state => state.user.longitude,
      latitude: state => state.user.latitude
    })
  },
  methods: {
    ...mapActions({
      getLocation: "user/getLocation"
    }),
    async tryGetLocation() {
      if (!this.colddown) {
        return;
      }
      this.colddown = false;
      const res = await this.getLocation();
      this.colddown = true;
    },
    TapToMine() {
      console.log("mine");
      mpvue.navigateTo({ url: "../mine/main" });
    }
  },
  created() {},
  mounted() {},
  updated() {
    console.log("polyline", this.polyline);
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