# sign

> 高速规划面试行程

## Build Setup

``` bash
# 初始化项目
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
yarn

# 开发时构建
npm dev

# 打包构建
npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

##功能列表
- [x] 首页
  - [x] 跳到添加面试
  - [x] 跳到个人中心
  - [x] 定位当前位置
- [ ] 个人中心
  - [x] 弹窗,申请获取手机号码权限
  - [x] 跳到我的面试
  - [ ] 客服中心

- [x] 添加面试页面
	- [x] 日期时间选择器
	- [x] 跳到选择面试地址
	- [x] 表单验证,不通过时,按钮为灰色,通过时,按钮为蓝色
	- [x] 点击确定,弹确认框添加成功,跳到面试列表页面
- [x] 选择面试地址
  - [x] 依靠腾讯地图search接口,获取地址
  - [x] 点击地址调回添加面试页面
- [x] 面试列表页面
	- [x] tab切换
	- [x] 点击面试信息,跳往面试详情
- [ ] 面试详情页面
  - [x] 渲染信息 
  - [x] 取消提醒
  - [ ] 去打卡,跳到打卡页面
  - [ ] 放弃面试,带确认框
- [ ] 打卡
  - [ ] 计算距离
  - [ ] 画圈 map里的方法
- [ ] 优化
  - [ ] 组件拆分
  - [ ] vuex拆分