/*
 * @Description: 权限指令
 * @Author: jrucker
 * @Date: 2020-12-28 10:39:21
 * @LastEditors: jrucker
 * @LastEditTime: 2022/07/15 15:11:29
 * @Example: v-permission="['权限名称']"
 */

import { useStore } from '@/store'
import { Directive } from 'vue'
import { isArray } from '@/utils'

function removeNode(el) {
  el.parentNode && el.parentNode.removeChild(el)
}

function checkPermission(el, value) {
  const perms = useStore().state.permission.accessedCodes
  if (!isArray(value)) throw new Error(`Need perms like v-permission="['权限名称']"`)
  if (value.length) {
    if (!perms.some(perm => value.includes(perm))) {
      removeNode(el)
    }
  }
}

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    checkPermission(el, value)
  },
  updated(el, binding) {
    const { value } = binding
    checkPermission(el, value)
  }
}
