import request from '@/utils/request'

export function createRefund(data) {
  return request({
    url: '/spba-api/refund/create',
    method: 'post',
    data
  })
}

// 获取买家的退款列表（带分页）
export function getBuyerRefund({ page, size, keyword = '' } = {}) {
  return request({
    url: '/spba-api/refund/getRefundListByBuyerId',
    method: 'get',
    params: { page, size, keyword }
  })
}

export function cancelRefund(refundId) {
  return request({
    url: '/spba-api/refund/cancelRefund?refundId=' + refundId,
    method: 'post'
  })
}

// 获取卖家的退款列表（带分页）
export function getSellerRefund({ page, size, keyword = '' } = {}) {
  return request({
    url: '/spba-api/refund/getRefundListBySellerId',
    method: 'get',
    params: { page, size, keyword }
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
