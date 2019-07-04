import fly from "@/utils/request";

// 获取code
export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res);
      }
    });
  });
}


// 获取用户信息openid和phone
export function code2session(code) {
  return fly.post("/user/code2session", {
    code
  });
}

// 获取面试列表
export function getList(opt){
	return fly.get('/sign',opt)
}

// 添加面试
export function addInterview(opt){
	return fly.post('/sign',opt)
}

// 获取面试详情
export function getDetail(id){
	return fly.get(`/sign/${id}`)
}
// 更新面试信息
export function updateDetail(id,params){
	return fly.put(`/sign/${id}`,params)
}
// 揭秘用户数据
export function encryptedData  (params){
  return fly.post('/user/decrypt',params)
}