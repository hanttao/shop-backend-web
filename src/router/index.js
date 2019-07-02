import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '@/components/Layout'
import User from '@/components/user/User'
import Right from '@/components/right/Right'
import Role from '@/components/right/Role'
import Category from '@/components/product/Category'

Vue.use(Router)

const defaultRouters = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login')
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/dashboard', // 重定向到子路由
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/components/dashboard'),
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/users',
        name: 'user',
        component: User,
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/rights',
        name: 'right',
        component: Right,
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/roles',
        name: 'role',
        component: Role,
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/categorys',
        name: 'category',
        component: Category,
        meta: {
          requireAuth: true,
        }
      }
    ]
  }
]

const router = new Router({
  routes: defaultRouters
})

router.beforeEach((to, from, next) => {

  NProgress.start()

  let mytoken = localStorage.getItem("mytoken")

  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (mytoken) {
      next();
      NProgress.done()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
      NProgress.done()
    }
  } else {
    next()
    NProgress.done()
  }
})

export default router
