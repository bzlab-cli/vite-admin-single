/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 17:34:22
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import elementVariables from '@/styles/element-variables.scss'
import layoutSettings from '@/config/layout'
import { store } from '@/store'

export interface SettingsState {
  theme: string
  fixedHeader: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

export const useSettingsStore = defineStore('settings', () => {
  const state = reactive<SettingsState>({
    theme: elementVariables.theme,
    fixedHeader: layoutSettings.fixedHeader,
    showTagsView: layoutSettings.showTagsView,
    showSidebarLogo: layoutSettings.showSidebarLogo,
    sidebarTextTheme: layoutSettings.sidebarTextTheme
  })

  const changeSetting = payload => {
    const { key, value } = payload
    switch (key) {
      case 'theme':
        state.theme = value
        break
      case 'fixedHeader':
        state.fixedHeader = value
        break
      case 'showSidebarLogo':
        state.showSidebarLogo = value
        break
      case 'showTagsView':
        state.showTagsView = value
        break
      case 'sidebarTextTheme':
        state.sidebarTextTheme = value
        break
      default:
        break
    }
  }

  return { ...toRefs(state), changeSetting }
})

export function useSettingsStoreHook() {
  return useSettingsStore(store)
}
