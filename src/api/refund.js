import request from '@/utils/request'

export function createRefund(data) {
  return request({
    url: '/spba-api/refund/create',
    method: 'post',
    data
  })
}

export function getBuyerRefund(params) {
  return request({
    url: '/spba-api/refund/getRefundListByBuyerId',
    method: 'get',
    params
  })
}

export function cancelRefund(refundId) {
  return request({
    url: '/spba-api/refund/cancelRefund?refundId=' + refundId,
    method: 'post'
  })
}

export function getSellerRefund(params) {
  return request({
    url: '/spba-api/refund/getRefundListBySellerId',
    method: 'get',
    params
  })
}

export function acceptRefund(refundId) {
  return request({
    url: '/spba-api/refund/acceptRefund?refundId=' + refundId,
    method: 'post'
  })
}

export function addExpress(refundId, Express) {
  return request({
    url: `/spba-api/refund/addrefundExpress?refundId=${refundId}&express=${Express}`,
    method: 'post'
  })
}

export function commit(id) {
  return request({
    url: `/spba-api/refund/commit?refundId=${id}`,
    method: 'post'
  })
}
