import request from '@/utils/request'

export function getFileList(data) {
  return request({
    module: 'cabinet',
    url: '/app-reverse/cabinetList',
    method: 'post',
    data: data
  })
}