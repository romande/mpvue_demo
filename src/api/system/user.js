import request from '@/utils/request'

export function getUserInfo() {
  return request({
    module: 'system',
    url: '/appUser/getInfo',
    method: 'get',
  })
}

export function getUserUsageProduct(data) {
  return request({
    module: 'global',
    data: data,
    url: '/product/Usage',
    method: 'post',
  })
}