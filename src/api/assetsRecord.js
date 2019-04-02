import request from '@/libs/axios'
import { baseUrl } from '../../public/config'

export function getAssetsRecharge (page) {
  return request({
    url: baseUrl + '/a/assetsRecharge/' + page + '/' + Date.parse(new Date()),
    method: 'get'
  })
}

export function getAssetsWithDraw (page) {
  return request({
    url: baseUrl + '/a/assetsWithDraw/' + page + '/' + Date.parse(new Date()),
    method: 'get'
  })
}
