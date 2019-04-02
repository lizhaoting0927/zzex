import request from '@/libs/axios'
import { baseUrl } from '../../public/config'
export function getWithdrawAddr (currency) {
  return request({
    url: baseUrl + '/a/withdrawAddr/' + currency + '/' + Date.parse(new Date()),
    method: 'get'
  })
}
export function getKaptcha () {
  return request({
    url: baseUrl + '/m/kaptcha',
    method: 'get'
  })
}
export function getMember () {
  return request({
    url: baseUrl + '/m/member',
    method: 'get'
  })
}
export function withdrawCreateI (data) {
  return request({
    url: baseUrl + '/a/withdraw/createI',
    data: data,
    method: 'post'
  })
}
export function getAssetsLst () {
  return request({
    url: baseUrl + '/m/assetsLst/' + Date.parse(new Date()),
    method: 'get'
  })
}

export function getwithdrawInfo (currency) {
  return request({
    url: baseUrl + `/a/withdrawInfo/${currency}`,
    method: 'get'
  })
}