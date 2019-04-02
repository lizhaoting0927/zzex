import request from '@/libs/axios'
import { baseUrl } from '../../public/config'
export function getTicker (symbol) {
  return request({
    url: baseUrl + '/m/ticker/' + symbol,
    method: 'get'
  })
}

export function getCurrencyInfo (currency) {
  return request({
    url: baseUrl + '/m/currency/info/' + currency,
    method: 'get'
  })
}
export function getSummary (symbol, type, size, allTicker, from) {
  return request({
    url: baseUrl + '/m/summary/' + symbol + '/' + type + '/' + size + '/' + allTicker + '/' + from + '/' + Date.parse(new Date()),
    method: 'get'
  })
}
export function getFavorite () {
  return request({
    url: baseUrl + '/m/favorite/' + Date.parse(new Date()),
    method: 'get'
  })
}
export function getOrdersI (symbol, page, status) {
  return request({
    url: baseUrl + '/o/ordersI/' + symbol + '/' + page + '/' + status + '/' + Date.parse(new Date()),
    method: 'get'
  })
}

export function orderCancel (id, no, symbol) {
  let data = {
    'id': id,
    'o_no': no,
    'symbol': symbol
  }
  return request({
    url: baseUrl + '/o/order/cancelI',
    data: data,
    method: 'post'
  })
}
export function orderCreate (data) {
  return request({
    url: baseUrl +  '/o/order/createI',
    data: data,
    method: 'post'
  })
}
