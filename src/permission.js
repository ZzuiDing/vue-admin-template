import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/', '/product'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  const hasToken = getToken()

  // 如果有 Token
  if (hasToken) {
    // 如果已经登录，且访问的是登录页面，直接跳转到主页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 如果用户有角色信息
      // console.log('store.getters.role', store.getters.role)
      // console.log('store.getters.name', store.getters.name)
      // const hasGetUserInfo = store.getters.name
      // console.log('hasGetUserInfo ', hasGetUserInfo)
      // console.log('store.getters.token', store.getters.token)
      const hasrole = store.getters.name && store.getters.token.length > 0
      // console.log('token', store.getters.token)
      // console.log('token.length', store.getters.token.length)
      // console.log('hasrole', hasrole)
      if (hasrole) {
        next() // 如果有角色，直接放行
      } else {
        try {
          // 通过 Vuex 获取用户信息
          await store.dispatch('user/getInfo')

          const role = store.getters.role// 获取用户角色
          // console.log('role',role)
          // 根据用户角色获取访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', role)
          console.log(accessRoutes)
          // console.log('role', role)
          // 动态添加路由
          router.addRoutes(accessRoutes)

          // 路由重定向到当前页面
          next({ ...to, replace: true })
        } catch (error) {
          // 捕获错误，重置 token，并跳转到登录页
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    // 如果没有 token
    const isWhitelisted = whiteList.some(path => to.path === path || to.path.startsWith(path + '/'))
    if (isWhitelisted) {
      // 如果当前路径在白名单中，允许访问
      next()
    } else {
      // 否则，跳转到登录页面
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
