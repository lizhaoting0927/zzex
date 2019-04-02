import request from '@/libs/axios'
import { baseUrl } from '../../public/config'

export function invitation () {
  return request({
    url:' http://47.75.218.160:8080/m/reutrncommi/intro/total',
    method: 'get'
  })
}

