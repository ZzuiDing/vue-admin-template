import request from '@/utils/request'

export function allgoodsList(params) {
  return request({
    url: '/spba-api/goods/ALLGoodsList',
    method: 'get',
    params
  })
}
