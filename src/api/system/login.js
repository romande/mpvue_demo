import request from '@/utils/request'

export function apiLogin(data) {
  return request({
    module: 'system',
    url: '/wechat/mp/login',
    method: 'post',
    data: data
  })
}