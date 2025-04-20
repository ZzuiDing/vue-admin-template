import request from '@/utils/request'

export function balance() {
  return request({
    url: '/spba-api/balance',
    method: 'get'
  })
}

export function pay(data) {
  return request({
    url: '/spba-api/pay',
    method: 'post',
    data: data
  })
}
