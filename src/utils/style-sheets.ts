/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/11/08 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/23 17:32:44
 */

import { nextTick } from 'vue'
import * as Icons from '@element-plus/icons'

const getElementPlusIconfont = () => {
  return new Promise(resolve => {
    nextTick(() => {
      const icons = [] as string[]
      Object.keys(Icons).forEach(key => {
        const name = Icons[key].name
        icons.push(name)
      })
      resolve(icons)
    })
  })
}

/**
 * 获取字体图标 `document.styleSheets`
 * @method ele 获取 element plus 图标
 */
const initIconfont = {
  // element plus
  ele: () => {
    return getElementPlusIconfont()
  }
}

export default initIconfont
