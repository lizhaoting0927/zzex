
import request from '@/libs/axios'
import { baseUrl } from '../../public/config'

export function getKaptcha () {
  return request({
    url: baseUrl + '/m/kaptcha',
    method: 'get'
  })
}
export function getMail (token, code, useraccount, type) {
  return request({
    url: baseUrl + '/m/mail/' + token + '/' + code + '/' + useraccount + '/' + type,
    method: 'get'
  })
}

export function member (data) {
  return request({
    url: baseUrl + '/m/member',
    data: data,
    method: 'post'
  })
}

export function forgotV2 (data) {
  return request({
    url: baseUrl + '/m/forgotV2',
    data: data,
    method: 'post'
  })
}
