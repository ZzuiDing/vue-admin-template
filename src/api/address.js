// src/api/address.js
import request from '@/utils/request'

/**
 * 获取所有地址
 */
export function getAllAddresses(params) {
  return request({
    url: '/spba-api/address/searchAddress',
    method: 'get',
    params
  })
}

/**
 * 搜索地址
 */
export function SearchAddresses(params) {
  return request({
    url: '/spba-api/address/searchAddress',
    method: 'get',
    params
  })
}

/**
 * 新增地址
 * @param {Object} data 地址对象
 */
export function createAddress(data) {
  return request({
    url: '/spba-api/address/addAddress',
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
    url: '/spba-api/address/updateAddress',
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
    url: `/spba-api/address/deleteAddress?id=${id}`,
    method: 'post'
  })
}
