/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 17:33:50
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getSidebarStatus, setSidebarStatus } from '@/utils/auth'
import { store } from '@/store'

export enum DeviceType {
  Mobile,
  Desktop
}
export interface AppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  size: string
}

export const useAppStore = defineStore('app', () => {
  const state = reactive<AppState>({
    device: DeviceType.Desktop,
    sidebar: {
      opened: getSidebarStatus() !== 'closed',
      withoutAnimation: false
    },
    size: 'medium'
  })

  const toggleSidebar = (withoutAnimation: boolean) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = withoutAnimation
    if (state.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  const closeSidebar = (withoutAnimation: boolean) => {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }
  const toggleDevice = (device: DeviceType) => {
    state.device = device
  }

  return {
    ...toRefs(state),
    toggleSidebar,
    closeSidebar,
    toggleDevice
  }
})

export function useAppStoreHook() {
  return useAppStore(store)
}
