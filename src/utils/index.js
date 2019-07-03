import moment from 'moment'

//转换时间格式
export const getDayTime = timestamp => {
  if (!timestamp) return ''
  if (`${timestamp}`.length < 13) {
    timestamp *= 1000
  }
  if (timestamp >= 0) {
    return moment(timestamp).format('YYYY-MM-DD')
  } else {
    return ''
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
