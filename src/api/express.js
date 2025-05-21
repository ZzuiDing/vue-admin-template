import request from '@/utils/request'

export function express(no, phone) {
  return request({
    url: '/spba-api/express/get',
    method: 'get',
    params: { no, phone }
  })
}
