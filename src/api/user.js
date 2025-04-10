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

/**
 * 获取用户列表
 */
export function getUserList() {
  return request({
    url: '/spba-api/user/getUserList',
    method: 'get'
  })
}

/**
 * 新增用户
 * @param {Object} data 用户对象
 */
export function addUser(data) {
  return request({
    url: '/spba-api/user/register',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param {Object} data 用户对象（含 id）
 */
export function updateUser(data) {
  return request({
    url: '/spba-api/user/updateUser',
    method: 'post',
    data
  })
}

/**
 * 删除指定用户
 * @param {number} id 用户ID
 */
export function deleteUserById(id) {
  return request({
    url: `/spba-api/user/deleteUser?id=${id}`,
    method: 'post'
  })
}
