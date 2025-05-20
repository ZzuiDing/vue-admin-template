import request from '@/utils/request'

// 获取错误日志列表
export function getErrorLogs(params) {
  return request({
    url: '/spba-api/error/logs',
    method: 'get',
    params
  })
}

export function getOperateLogs(params) {
  return request({
    url: '/spba-api/operate/logs',
    method: 'get',
    params
  })
}
