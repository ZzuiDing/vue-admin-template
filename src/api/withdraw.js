import request from '@/utils/request'

// 获取提现申请列表（分页）
export function getWithdrawRequests(params) {
  return request({
    url: '/spba-api/withdraw/getRequests',
    method: 'get',
    params // { pageNum: 1, pageSize: 10 }
  })
}

// 用户发起提现申请
export function generateWithdraw(data) {
  return request({
    url: '/spba-api/withdraw/generate',
    method: 'post',
    data // { userId, amount, ... }
  })
}

// 管理员确认提现（审核通过）
export function confirmWithdraw(id) {
  return request({
    url: '/spba-api/withdraw/confirm',
    method: 'post',
    params: { id } // 通过 ?id=xxx 传参
  })
}
