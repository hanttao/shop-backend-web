import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User'
import Right from '@/components/right/Right'
import Role from '@/components/right/Role'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/welcome', // 重定向到子路由
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component: Welcome
        },
        {
          path: '/user',
          name: 'user',
          component: User
        },
        {
          path: '/rights',
          name: 'right',
          component: Right
        },
        {
          path: '/roles',
          name: 'role',
          component: Role
        }
      ]
    }
  ]
})
