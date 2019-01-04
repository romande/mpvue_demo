import request from '@/utils/request'

export function repeal(data) {
  return request({
    module: 'cabinet',
    url: '/app-reverse/cancel-reverse',
    method: 'post',
    data: data
  })
}