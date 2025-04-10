// src/api/address.js
import request from '@/utils/request'

/**
 * 获取所有地址
 */
export function getAllAddresses() {
  return request({
    url: '/spba-api/address/getAll',
    method: 'get'
  })
}

/**
 * 新增地址
 * @param {Object} data 地址对象
 */
export function createAddress(data) {
  return request({
    url: '/spba-api/address/create',
    method: 'post',
    data
  })
}

/**
 * 修改地址
 * @param {Object} data 地址对象（含 id）
 */
export function updateAddress(data) {
  return request({
    url: '/spba-api/address/update',
    method: 'post',
    data
  })
}

/**
 * 删除指定地址
 * @param {number} id 地址ID
 */
export function deleteAddressById(id) {
  return request({
    url: `/spba-api/address/delete?id=${id}`,
    method: 'post'
  })
}
