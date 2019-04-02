import request from '@/libs/axios'
import { baseUrl } from '../../public/config'

export function getAccountsI () {
  return request({
    url: baseUrl + '/a/accountsI',
    method: 'get'
  })
}

export function getAssetsLst () {
  return request({
    url: baseUrl + '/m/assetsLst/' + Date.parse(new Date()),
    method: 'get'
  })
}

export function getSummary (symbol, type, size, allTicker, from) {
  return request({
    url: baseUrl + '/m/summary/' + symbol + '/' + type + '/' + size + '/' + allTicker + '/' + from + '/' + Date.parse(new Date()),
    method: 'get'
  })
}
