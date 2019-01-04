import request from '@/utils/request'

export function getCodeContent(data) {
    return request({
      module: 'cabinet',
      version: 'v1.1',
      url: '/app-reverse/takePartQR',
      method: 'post',
      data: data
    })
  }