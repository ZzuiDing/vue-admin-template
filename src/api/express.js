import request from '@/utils/request'

export function express(no) {
  return request({
    url: '/spba-api/express/get',
    method: 'get',
    params: { no }
  })
}
