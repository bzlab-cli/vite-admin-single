/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 17:34:43
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'
import { store } from '@/store'

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
}

export interface TagsState {
  cachedViews: (string | undefined)[]
}

export const useTagsStore = defineStore('tags', () => {
  const state = reactive<TagsState>({
    cachedViews: []
  })

  const addCacheView = views => {
    state.cachedViews = views
  }

  const removeCacheView = view => {
    if (!view) return
    const index = state.cachedViews.indexOf(view?.toString())
    index > -1 && state.cachedViews.splice(index, 1)
  }

  return { ...toRefs(state), addCacheView, removeCacheView }
})

export function useTagsStoreHook() {
  return useTagsStore(store)
}
