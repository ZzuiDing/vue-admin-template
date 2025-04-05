/**
 * Created by PanJiaChen on 16/11/18.
 */

import request from '@/utils/request'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  request.get('http://localhost:9090/spba-api/user/getUserNames'
  ).then(res => {
    console.log(res.data)
    if (res.code === 20000) {
      const valid_map = res.data
      const flag = valid_map.indexOf(str.trim()) >= 0
      console.log(flag)
      return flag
    } else {
      return false
    }
  })
}
