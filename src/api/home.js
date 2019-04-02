import request from '@/libs/axios'
import { baseUrl } from '../../public/config'

export function getNewsBanner () {
  return request({
    url: baseUrl + '/n/news/banner',
    method: 'get'
  })
}
export function getRecently (page, pagesize) {
  return request({
    url: baseUrl + '/n/news/recently/' + page + '/' + pagesize,
    method: 'get'
  })
}

export function getNewsList (id, page, pagesize) {
  return request({
    url: baseUrl + '/n/news/' + id + '/' + page + '/' + pagesize,
    method: 'get'
  })
}

export function getAllTicker () {
  return request({
    url: baseUrl + '/m/allticker/' + Date.parse(new Date()),
    method: 'get'
  })
}

export function getFavorite () {
  return request({
    url: baseUrl + '/m/favorite/' + Date.parse(new Date()),
    method: 'get'
  })
}

export function favorite (pair) {
  let data = {
    'pair_dsp_name': pair
  }
  return request({
    url: baseUrl + '/m/favorite',
    method: 'post',
    data: data
  })
}

export function favoriteDel (pair) {
  let data = {
    'pair_dsp_name': pair
  }
  return request({
    url: baseUrl + '/m/favorite/del',
    method: 'post',
    data: data
  })
}
export function tokenLogin(data) {
  return request({
    url: `${baseUrl}/m/tokenLogin`,
    data,
    method: 'post',
  });
}