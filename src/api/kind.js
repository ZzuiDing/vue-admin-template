// src/api/kind.js
import request from '@/utils/request'

/**
 * 获取所有商品种类
 */
export function getAllKinds(params) {
  return request({
    url: '/spba-api/kind/getAll',
    method: 'get',
    params: params // 传递分页参数
  })
}

/**
 * 新增商品种类
 * @param {Object} data { kindName: string, … }
 */
export function addKind(data) {
  return request({
    url: '/spba-api/kind/add',
    method: 'post',
    data
  })
}

/**
 * 修改商品种类
 * @param {Object} data { id: number, kindName: string, … }
 */
export function updateKind(data) {
  return request({
    url: '/spba-api/kind/update',
    method: 'post',
    data
  })
}

/**
 * 删除指定商品种类
 * @param {number} id
 */
export function deleteKindById(id) {
  return request({
    url: `/spba-api/kind/delete?id=${id}`,
    method: 'post'
  })
}
