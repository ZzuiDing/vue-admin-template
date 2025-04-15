import request from '@/utils/request'

export function getCommentsByGoodId(goodId, pageNum = 1, pageSize = 5) {
  return request({
    url: 'spba-api/goodComment/getByGoodid',
    method: 'get',
    params: { goodId, pageNum, pageSize }
  })
}

export function addComment(commentData) {
  return request({
    url: 'spba-api/goodComment/add',
    method: 'post',
    data: commentData
  })
}
