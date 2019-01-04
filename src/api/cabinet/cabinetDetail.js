import request from '@/utils/request'

export function getDetail(data) {
  return request({
    module: 'cabinet',
    url: '/app-reverse/' + data,
    method: 'get'
  })
}