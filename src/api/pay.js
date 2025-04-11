import request from '@/utils/request'

export function alipay(data) {
  return request({
    url: 'http://localhost:9090/spba-api/pay/pay/alipay',
    method: 'post',
    headers: {
      'Content-Type': 'application/json' // 设置 Content-Type 为 application/json
    },
    data: data // 发送封装后的对象
  })
}

export function checkpay(data) {
  return request({
    url: `http://localhost:9090/spba-api/order/order/check-pay`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json' // 设置 Content-Type 为 application/json
    },
    data: data // 发送封装后的对象
  })
}
