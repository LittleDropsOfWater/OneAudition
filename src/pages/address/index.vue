<template>
  <div class="counter-warp">
    <div class="inputRow">
      <span>{{region}}</span>
      <input placeholder="面试地址" type="text" @input="search" auto-focus />
    </div>
    <div v-for="item in markers" :key="item.id" class="item" @click="select(item)">
      <div class="icon">
        <img src="/static/images/logo.png" />
      </div>
      <div class="view">
        <p class="title">{{item.title}}</p>
        <p class="address">{{item.address}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import QQMapWX from "@/utils/qqmap";
import { mapMutations, mapState } from "vuex";
import { debounce } from "@/utils";
export default {
  data() {
    return {
      markers: [],
      oldtime: 0,
      searchFn: null,
      page: 1,
      pageSize: 10,
      pullUpFlag: true,
      keyword: "",
      region:'北京市',
    };
  },
  computed: {
    ...mapState({
      latitude: state => state.user.latitude,
      longitude: state => state.user.longitude
    })
  },
  methods: {
    ...mapMutations({
      updateCurAddress: "address/updateCurAddress"
    }),
    search(e) {
      let keyword = e.target.value.trim();
      this.keyword = keyword;
      if (keyword.length === 0) {
        return;
      }
      this.markers = [];
      this.page = 1;
      this.pullUpFlag = true;
      console.log("keyword", keyword);
      this.searchFn(keyword);
    },
    select(item) {
      // 更新面试地址
      this.updateCurAddress(item);
      // 跳回添加面试页面
      wx.navigateBack({
        delta: 1
      });
    }
  },
  created() {
    this.qqmapsdk = new QQMapWX({
      key: "X7RBZ-MMOKR-UQEWJ-WSCXC-IVXVK-IFFLL"
    });
    var _this = this;
    this.searchFn = debounce(function(keyword) {
      console.log("keyword", keyword);

      // 调用接口
      _this.qqmapsdk.search({
        keyword: keyword, //搜索关键词
        location: `${_this.latitude},${_this.longitude}`, //设置周边搜索中心点
        region: _this.region,
        page_index: _this.page,
        pageSize: _this.pageSize,
        success: function(res) {
          //搜索成功后的回调
          var mks = [];
          for (var i = 0; i < res.data.length; i++) {
            mks.push({
              // 获取返回结果，放到mks数组中
              ...res.data[i],
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng
            });
          }
          //设置markers属性，将搜索结果显示在地图中
          _this.markers = _this.markers.concat(mks);
          console.log("mks: ", mks);
          console.log("markers", _this.markers);

          if (mks.length < 10) {
            _this.pullUpFlag = false;
          }
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          console.log(res);
        }
      });
    }, 600);
  },
  async onReachBottom(e) {
    console.log(e, this.pullUpFlag, this.page, this.keyword);
    if (!this.pullUpFlag) {
      return;
    }
    this.page += 1;
    this.searchFn(this.keyword);
  }
};
</script>

<style   lang='scss'>
.inputRow {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 40rpx;
  & span:first-child {
    margin-right: 30px;
  }
}

.item {
  padding: 20rpx;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}
.icon {
  margin-left: 10rpx;
  margin-right: 30rpx;
  img {
    width: 80rpx;
    height: 80rpx;
  }
}
.view {
  flex: 1;
}
.title {
  font-size: 40rpx;
  margin-bottom: 20rpx;
}
.address {
  color: #999;
  font-size: 24rpx;
}
</style>
