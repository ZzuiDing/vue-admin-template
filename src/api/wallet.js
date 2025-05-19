import request from '@/utils/request'

export function balance() {
  return request({
    url: '/spba-api/wallet/balance',
    method: 'get'
  })
}

export function pay(data) {
  return request({
    url: '/spba-api/wallet/pay',
    method: 'post',
    data: data
  })
}
