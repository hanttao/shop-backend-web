import axios from 'axios'
// 设置请求的基准路径
// axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/'
// 请求本地配置node后台环境 访问的路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 登录拦截器 拦截处理token
axios.interceptors.request.use(function (config) {
  // 获取当前是否存在token
  let token = localStorage.getItem('mytoken')
  if (token) {
    // Authorization 请求头的键是前后台约定
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 实现登录功能
export const login = (params) => {
  return axios.post('login', params).then(res => {
    // 返回具体的数据
    return res.data
  })
}
// 请求数据
export const getUsersData = (params) => {
  return axios.get('users', {params: params}).then(res => {
    return res.data
  })
}
// 用户管理-用户状态
export const toggleUserState = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.put('users/' + params.uId + '/state/' + params.state).then(res => {
    return res.data
  })
}
// 用户管理-删除用户
export const deleteUserData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.delete('users/' + params.uId).then(res => {
    return res.data
  })
}
// 用户管理-添加用户
export const addUserData = (params) => {
  return axios.post('users', params).then(res => {
    return res.data
  })
}
// 用户管理-用户状态
export const editUserData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.put('users/' + params.uId).then(res => {
    return res.data
  })
}
