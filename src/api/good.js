import request from '@/utils/request'

export function allgoodsList(params) {
  return request({
    url: '/spba-api/goods/ALLGoodsList',
    method: 'get',
    params
  })
}
export function add(params) {
  return request({
    url: '/spba-api/goods/add',
    method: 'post',
    params
  })
}
