import request from '@/utils/request'

export function getNoticeList(data) {
    return request({
      module: 'global',
      url: '/app-notice/list',
      method: 'post',
      data: data
    })
  }