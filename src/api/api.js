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
  return axios.put('users/' + params.id + '/state/' + params.state).then(res => {
    return res.data
  })
}
// 用户管理-添加用户
export const addUserData = (params) => {
  return axios.post('users', params).then(res => {
    return res.data
  })
}
// 用户管理-查询用户
export const getUserById = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.get('users/' + params.id).then(res => {
    return res.data
  })
}
// 用户管理-编辑用户
export const editUserData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.put('users/' + params.id, params).then(res => {
    return res.data
  })
}
// 用户管理-删除用户
export const deleteUserData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.delete('users/' + params.id).then(res => {
    return res.data
  })
}
// 用户管理-分配用户角色
export const grantUserRole = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.put('users/' + params.id + '/role', params).then(res => {
    return res.data
  })
}
// 权限管理-权限列表数据获取
export const rightList = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.get('rights/' + params.type).then(res => {
    return res.data
  })
}
// 权限管理-获取第一层角色信息
export const getRoles = () => {
  // restful形式的url   /users/512/state/true
  return axios.get('roles').then(res => {
    return res.data
  })
}
// 权限管理-添加角色
export const addRoleData = (params) => {
  return axios.post('roles', params).then(res => {
    return res.data
  })
}
// 权限管理-查询角色
export const getRoleById = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.get('roles/' + params.id).then(res => {
    return res.data
  })
}
// 权限管理-编辑角色
export const editRoleData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.put('roles/' + params.id, params).then(res => {
    return res.data
  })
}
// 权限管理-删除角色
export const deleteRoleData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.delete('roles/' + params.id).then(res => {
    return res.data
  })
}
// 权限管理-删除角色权限
export const deleteRoleRight = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.delete('roles/' + params.roleId + '/rights/' + params.rightId).then(res => {
    return res.data
  })
}
// 权限管理-角色授权
export const submitGrant = (params) => {
  return axios.post('roles/' + params.id + '/rights', params).then(res => {
    return res.data
  })
}
// 商品管理-数据获取
export const getCategorysData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.get('categories', {params: params}).then(res => {
    return res.data
  })
}
// 商品管理-添加分类
export const addCategoryData = (params) => {
  return axios.post('categories', params).then(res => {
    return res.data
  })
}
// 商品管理-查询分类
export const getCategoryById = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.get('categories/' + params.id).then(res => {
    return res.data
  })
}
// 商品管理-编辑分类提交
export const editCategoryData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.put('categories/' + params.cat_pid, params).then(res => {
    return res.data
  })
}
// 商品管理-删除分类
export const deleteCategoryData = (params) => {
  // restful形式的url   /users/512/state/true
  return axios.delete('categories/' + params.id).then(res => {
    return res.data
  })
}
// 左侧菜单权限--获取菜单列表
export const getMenu = (params) => {
  return axios.get('menus').then(res => {
    return res.data
  })
}
