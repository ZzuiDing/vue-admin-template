// src/api/goods.js
import request from '@/utils/request'

/**
 * 获取所有商品（管理员使用），支持分页
 * @param {Object} params 分页参数 { pageNum, pageSize }
 */
export function getAllGoods(params) {
  return request({
    url: '/spba-api/goods/ALLGoodsList',
    method: 'get',
    params // 将分页参数传递给后端
  })
}

/**
 * 获取当前用户的商品（普通用户使用），支持分页
 * @param {Object} params 分页参数 { pageNum, pageSize }
 */
export function getGoodsByUserId(params) {
  return request({
    url: '/spba-api/goods/GoodListByUserId',
    method: 'get',
    params // 将分页参数传递给后端
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

/**
 * 获取热销商品
 * @returns {Promise} 热销商品列表
 */
export function topSoldGoods() {
  return request({
    url: '/spba-api/goods/topSoldGoods',
    method: 'get'
  })
}

/**
 * 获取最新商品
 * @returns {Promise} 热销商品列表
 */
export function newestGoods() {
  return request({
    url: '/spba-api/goods/newestGoods',
    method: 'get'
  })
}

/**
 * 获取商品详情
 * @param {number} id 商品ID
 */
export function getGoodById(id) {
  return request({
    url: `/spba-api/goods/detail?id=${id}`,
    method: 'get'
  })
}

/**
 * 更新商品的上架/下架状态
 * @param {number} id 商品ID
 */
export function updateStatus(id) {
  return request({
    url: `/spba-api/goods/goodStatus?id=${id}`,
    method: 'post'
  })
}
