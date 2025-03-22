import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/spba-api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/spba-api/user/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getuserList(params) {
  return request({
    url: '/spba-api/user/list',
    method: 'get',
    params
  })
}
