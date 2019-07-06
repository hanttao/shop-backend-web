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
          requireAuth: true, title: '首页'
        }
      },
      {
        path: '/users',
        name: 'user',
        component: User,
        meta: {
          requireAuth: true, title: '用户列表'
        }
      },
      {
        path: '/rights',
        name: 'right',
        component: Right,
        meta: {
          requireAuth: true, title: '权限列表'
        }
      },
      {
        path: '/roles',
        name: 'role',
        component: Role,
        meta: {
          requireAuth: true, title: '角色列表'
        }
      },
      {
        path: '/goods',
        name: 'good',
        component: () => import('@/components/product'),
        meta: {
          requireAuth: true, 
        },
        redirect: '/list', // 重定向到子路由
        children: [
          {
            path: '/list',
            name: 'list',
            component: () => import('@/components/product/Good'),
            meta: {
              requireAuth: true, title: '商品列表'
            }
          },
          {
            path: '/addGood',
            name: 'addGood',
            component: () => import('@/components/product/addGood'),
            meta: {
              requireAuth: true, title: '添加商品'
            }
          },
          {
            path: '/editGood',
            name: 'editGood',
            component: () => import('@/components/product/editGood'),
            meta: {
              requireAuth: true, title: '编辑商品'
            }
          }
        ]
      },
      {
        path: '/categorys',
        name: 'category',
        component: Category,
        meta: {
          requireAuth: true, title: '商品分类'
        }
      },
      {
        path: '/orders',
        name: 'order',
        component: () => import('@/components/order'),
        meta: {
          requireAuth: true, title: '商品分类'
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
