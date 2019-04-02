import request from '@/libs/axios'
import request2 from '@/libs/axios2'

import { baseUrl } from '../../public/config'

export function getAuthindentity () {
  return request({
    url: baseUrl + '/m/authindentity',
    method: 'get'
  })
}

export function getAliOssPolicy () {
  return request({
    url: baseUrl + '/m/aliOssPolicy',
    method: 'get'
  })
}

export function authIdentity (data) {
  return request({
    url: baseUrl + '/m/authIdentity',
    data: data,
    method: 'post'
  })
}

export function postImg (url, formData) {
  return request2({
    url: url,
    data: formData,
    method: 'post'
  })
}
