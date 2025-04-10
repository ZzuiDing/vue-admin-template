// src/api/goods.js
import request from '@/utils/request'

/**
 * 获取所有商品（管理员使用）
 */
export function getAllGoods() {
  return request({
    url: '/spba-api/goods/ALLGoodsList',
    method: 'get'
  })
}

/**
 * 获取当前用户的商品（普通用户使用）
 */
export function getGoodsByUserId() {
  return request({
    url: '/spba-api/goods/GoodListByUserId',
    method: 'get'
  })
}

/**
 * 新增商品
 * @param {Object} data 商品对象
 */
export function addGood(data) {
  return request({
    url: '/spba-api/goods/add',
    method: 'post',
    data
  })
}

/**
 * 修改商品
 * @param {Object} data 商品对象（含 id）
 */
export function updateGood(data) {
  return request({
    url: '/spba-api/goods/update',
    method: 'post',
    data
  })
}

/**
 * 删除指定商品
 * @param {number} id 商品ID
 */
export function deleteGoodById(id) {
  return request({
    url: `/spba-api/goods/delete?id=${id}`,
    method: 'post'
  })
}
