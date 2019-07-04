
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger'

// 引入子模块
import index from './moduels/index'
import user from './moduels/user'
import address from './moduels/address'

Vue.use(Vuex);
export default new Vuex.Store({
	modules:{
		index,
		user,
		address,
	},
	plugins:[createLogger()]
})