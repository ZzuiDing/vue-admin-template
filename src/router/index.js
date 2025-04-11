import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    name: 'MainPage',
    component: () => import('@/views/front/mainpage.vue'),
    meta: { title: '主页', icon: 'home' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/front/ProductDetailPage.vue'),
    props: true
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/front/Checkout.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/orderSuccess',
    component: () => import('@/views/front/OrderSuccess.vue'),
    name: 'OrderSuccess'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/backend/dashboard',
    component: Layout,
    redirect: '/backend/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/dashboard'),
        meta: { title: 'dash', icon: 'form' }
      }
    ]
  },

  {
    path: '/GoodManagement',
    component: Layout,
    redirect: '/GoodManagement/dashboard',
    name: 'GoodManagement',
    meta: { title: '商品管理', icon: 'el-icon-s-help' }, // 管理员和用户角色都可以访问
    children: [
      {
        path: 'Dashboard',
        name: '商品浏览',
        component: () => import('@/views/Good/GoodManagement.vue'),
        meta: { title: '商品管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/order',
    name: '管理',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '订单管理', icon: 'form' }, // 只有用户角色可以访问
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/order/order.vue'),
        meta: { title: '订单管理', icon: 'form' }
      },
      {
        path: 'refund',
        name: 'refund',
        component: () => import('@/views/refund/refund.vue'),
        meta: { title: '退款管理', icon: 'form' } // 只允许管理员角色访问
      }
    ]
  },
  {
    path: '/kind',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '种类管理',
        component: () => import('@/views/kind/kind.vue'),
        meta: { title: '种类管理', icon: 'kind' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * These routes require dynamic loading based on user roles
 */
export const asyncRoutes = [
  {
    path: '/UserManagement',
    component: Layout,
    redirect: '/UserManagement/dashboard',
    name: 'UserManagement',
    meta: { title: '用户管理', icon: 'el-icon-s-help', roles: 2 }, // 只允许管理员角色访问
    children: [
      {
        path: 'Dashboard',
        name: '用户浏览',
        component: () => import('@/views/User/UserManagement.vue'),
        meta: { title: '用户管理', icon: 'tree', roles: 2 }
      }
    ]
  },
  {
    path: '/address',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/address/address.vue'),
        meta: { title: '我的地址', icon: 'form', roles: 1 } // 只允许用户角色访问
      }
    ]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

/**
 * 判断是否有权限访问该路由
 * @param {Array} roles - 用户角色
 * @param {Object} route - 路由对象
 */
function hasPermission(roles, route) {
  // 如果路由配置了roles，检查当前角色是否在其中
  if (route.meta && route.meta.roles) {
    return route.meta.roles.some(roles => roles.includes(roles)) // 允许多个角色
  }
  return true
}

/**
 * 根据角色过滤需要的路由
 * @param {Array} routes - 路由数组
 * @param {Array} roles - 用户角色数组
 * @returns {Array} 过滤后的路由
 */
function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 在用户登录后，根据角色动态添加路由
export function setRoutes(roles) {
  const accessRoutes = filterAsyncRoutes(asyncRoutes, roles)
  accessRoutes.forEach(route => {
    router.addRoute(route) // 添加动态路由
  })
}

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
