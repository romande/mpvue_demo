import request from '@/utils/request'

export function getCompany() {
  return request({
    module: 'system',
    url: '/company/deptList',
    method: 'get'
  })
}
export function getOffice(companyId) {
  return request({
    module: 'cabinet',
    url: '/app-reverse/list-by-companyId/' + companyId,
    method: 'get'
  })
}
export function getUser(officeId) {
  return request({
    module: 'cabinet',
    url: '/app-reverse/list-by-office/' + officeId,
    method: 'get'
  })
}
export function appoint(data) {
  return request({
    module: 'cabinet',
    url: '/app-reverse/appoint',
    method: 'post',
    data: data
  })
}
