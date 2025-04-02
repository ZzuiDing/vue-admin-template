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
    url: 'http://localhost:9090/spba-api/user/logout',
    method: 'get'
  })
}

export function getuserList(params) {
  return request({
    url: '/spba-api/user/list',
    method: 'get',
    params
  })
}
