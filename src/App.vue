<script>
import { setOpenid,code2session } from "@/utils";
import {mapActions} from 'vuex';
export default {
  computed: {
    ...mapActions({
      login:'user/login',
    })
  },
  async created() {
    //设置openid
  console.log('setOpenid Start');
  this.login()  

  }
};
</script>

<style>
page {
  height: 100%;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
