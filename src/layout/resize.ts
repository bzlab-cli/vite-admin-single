/*
 * @Description: 根据大小变化重新布局
 * @Author: jrucker
 * @Date: 2020-12-17 15:37:56
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 17:56:43
 */

import { useAppStore, DeviceType } from '@/store/modules/app'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
const WIDTH = 992

export default function () {
  const appStore = useAppStore()
  const device = computed(() => {
    return appStore.device
  })

  const sidebar = computed(() => {
    return appStore.sidebar
  })

  const currentRoute = useRoute()
  const watchRouter = watch(
    () => currentRoute.name,
    () => {
      if (appStore.device === DeviceType.Mobile && appStore.sidebar.opened) {
        appStore.closeSidebar(false)
      }
    }
  )

  const isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const resizeMounted = () => {
    if (isMobile()) {
      appStore.toggleDevice(DeviceType.Mobile)
      appStore.closeSidebar(true)
    }
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      appStore.toggleDevice(isMobile() ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile()) {
        appStore.closeSidebar(true)
      }
    }
  }
  const addEventListenerOnResize = () => {
    window.addEventListener('resize', resizeHandler)
  }

  const removeEventListenerResize = () => {
    window.removeEventListener('resize', resizeHandler)
  }

  return {
    device,
    sidebar,
    resizeMounted,
    addEventListenerOnResize,
    removeEventListenerResize,
    watchRouter
  }
}
