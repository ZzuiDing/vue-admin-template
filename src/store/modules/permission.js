// store/modules/permission.js
import { asyncRoutes, constantRoutes } from '@/router'

// 判断当前角色是否有权限访问某个路由
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    console.log('Checking route.meta.roles:', route.meta.roles)
    console.log('User roles:', roles)
    console.log('includes: ', route.meta.roles.includes(roles))
    return route.meta.roles.includes(roles) // 检查角色是否符合
  }
  return true
}

// 递归过滤路由
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    console.log('Checking route:', route) // 打印正在检查的路由
    const tmp = { ...route }

    // 检查当前角色是否有权限访问该路由
    if (hasPermission(roles, tmp)) {
      console.log('Has permission for route:', route.path) // 打印有权限的路由
      // 如果有子路由，递归调用过滤子路由
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 所有路由（包括静态和动态路由）
  addRoutes: [] // 动态添加的路由
}

const mutations = {
  // 设置路由
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes // 保存动态路由
    state.routes = constantRoutes.concat(routes) // 合并静态路由和动态路由
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    console.log('generateRoutes called') // 确保该方法被调用
    return new Promise(resolve => {
      console.log('roles: ', roles) // 打印用户角色
      // 过滤出符合权限的路由
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      console.log('accessedRoutes: ', accessedRoutes) // 打印被过滤的路由
      commit('SET_ROUTES', accessedRoutes) // 提交到Vuex
      console.log('state.routes: ', state.routes) // 打印合并后的路由
      resolve(accessedRoutes) // 返回动态路由
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
