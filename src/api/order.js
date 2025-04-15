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
 * 直接生成订单
 */
export function createOrder(goodId, amount, addressId) {
  return request({
    url: `/spba-api/order/createDirect?goodId=${goodId}&amount=${amount}&addressId=${addressId}`,
    method: 'post',
    goodId,
    amount,
    addressId
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

/**
 * 获取订单详情
 * @param status
 * @returns {*}
 * @constructor
 */
export const getOrderListByStatus = (status) => {
  return request({
    url: `/spba-api/order/getOrderListByStatus?status=${status}`,
    method: 'get'
  })
}

// 获取买家订单列表
export function getBuyerOrderList(pageNum = 1, pageSize = 10, buyerId) {
  return request({
    url: '/spba-api/order/getFromBuyer',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      BuyerId: buyerId
    }
  })
}

// 获取卖家订单列表
export function getSellerOrderList(pageNum = 1, pageSize = 10, sellerId) {
  return request({
    url: '/spba-api/order/getFromSeller',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      SellerId: sellerId
    }
  })
}

// 更新订单描述
export function updateOrderDesc(orderId, desc) {
  return request({
    url: '/spba-api/order/UpdateDesc',
    method: 'get',
    params: {
      orderId,
      desc
    }
  })
}

// 更新订单状态
export function updateOrderStatus(orderId, status) {
  return request({
    url: '/spba-api/order/UpdateStatus',
    method: 'get',
    params: {
      orderId,
      status
    }
  })
}

// 删除订单（前提是“待支付”或“已取消”）
export function deleteOrder(orderId) {
  return request({
    url: '/spba-api/order/delete',
    method: 'get',
    params: {
      orderId
    }
  })
}

// 取消订单（仅限“待支付”状态）
export function cancelOrder(orderId) {
  return request({
    url: '/spba-api/order/cancel',
    method: 'get',
    params: {
      orderId
    }
  })
}

// 发货
export function deliverOrder(orderId, expressId) {
  return request({
    url: '/spba-api/order/updateExpressId',
    method: 'get',
    params: {
      orderId,
      expressId
    }
  })
}

export function summary() {
  return request({
    url: '/spba-api/order/order/status-count',
    method: 'get'
  })
}

export function summarySeller() {
  return request({
    url: '/spba-api/order/order/status-countSeller',
    method: 'get'
  })
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request({
    url: '/spba-api/order/getOrderById?orderId=' + orderId,
    method: 'get'
  })
}
