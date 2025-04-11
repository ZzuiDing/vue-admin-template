// src/api/order.js
import request from '@/utils/request'

/**
 * 获取订单列表
 */
export function getOrderList() {
  return request({
    url: '/spba-api/order/getOrderList',
    method: 'get'
  })
}

/**
 * 新增订单
 * @param CartIds
 * @param AddressId
 */
export function addOrder(CartIds, AddressId) {
  return request({
    url: `/spba-api/order/create?CartIds=${CartIds}&AddressId=${AddressId}`,
    method: 'post'
    // data
  })
}

/**
 * 修改订单
 * @param {Object} data 订单对象（含 id）
 */
export function updateOrder(data) {
  return request({
    url: '/spba-api/order/updateOrder',
    method: 'post',
    data
  })
}

/**
 * 删除指定订单
 * @param {number} id 订单ID
 */
export function deleteOrderById(id) {
  return request({
    url: `/spba-api/order/deleteOrder?id=${id}`,
    method: 'post'
  })
}
