import request from '@/libs/axios'
import { baseUrl } from '../../public/config'

export function getAssetsRechargeAddr (currency) {
  return request({
    url: baseUrl + '/a/assetsRechargeAddr/' + currency + '/' + Date.parse(new Date()),
    method: 'get'
  })
}
export function genCoinAddress (data) {
  return request({
    url: baseUrl + '/a/genCoinAddress',
    data: data,
    method: 'post'
  })
}

export function getAssetsRecharge (page) {
  return request({
    url: baseUrl + '/a/assetsRecharge/' + page + '/' + Date.parse(new Date()),
    method: 'get'
  })
}
export function getAssetsLst () {
  return request({
    url: baseUrl + '/m/assetsLst/' + Date.parse(new Date()),
    method: 'get'
  })
}
