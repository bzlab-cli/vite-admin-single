<template>
  <div class="icon-selector">
    <el-popover
      placement="bottom"
      trigger="click"
      :width="fontIconWidth"
      v-model:visible="fontIconVisible"
      popper-class="icon-selector-popper"
    >
      <template #reference>
        <el-input
          v-model="fontIconSearch"
          :placeholder="fontIconPlaceholder"
          :clearable="clearable"
          :disabled="disabled"
          :size="size"
          style="width: 267px"
          ref="inputWidthRef"
          @clear="onClearFontIcon"
          @focus="onIconFocus"
          @blur="onIconBlur"
        >
          <template #prepend>
            <el-icon class="font14 ele">
              <component :is="fontIconPrefix === '' ? prepend : fontIconPrefix" />
            </el-icon>
          </template>
        </el-input>
      </template>
      <transition name="el-zoom-in-top">
        <div class="icon-selector-wrap" v-show="fontIconVisible">
          <div class="icon-selector-wrap-title">{{ title }}</div>
          <div class="icon-selector-wrap-row">
            <el-scrollbar>
              <el-row :gutter="10" v-if="fontIconSheetsFilterList.length > 0">
                <el-col
                  :xs="6"
                  :sm="4"
                  :md="4"
                  :lg="4"
                  :xl="4"
                  @click="onColClick(v)"
                  v-for="(v, k) in fontIconSheetsFilterList"
                  :key="k"
                >
                  <div class="icon-selector-wrap-item" :class="{ 'icon-selector-active': fontIconPrefix === v }">
                    <div class="flex-margin">
                      <div class="icon-selector-wrap-item-value">
                        <el-icon>
                          <component :is="v" />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-empty :image-size="100" v-if="fontIconSheetsFilterList.length <= 0" :description="emptyDescription" />
            </el-scrollbar>
          </div>
        </div>
      </transition>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, nextTick, computed, watch } from 'vue'
import initIconfont from '@/utils/style-sheets'

export default {
  name: 'iconSelector',
  emits: ['update:modelValue', 'get', 'clear'],
  props: {
    // 输入框前置内容
    prepend: {
      type: String,
      default: () => 'Menu'
    },
    // 输入框占位文本
    placeholder: {
      type: String,
      default: () => '请输入内容搜索图标或者选择图标'
    },
    // 输入框占位文本
    size: {
      type: String,
      default: () => 'default'
    },
    // 弹窗标题
    title: {
      type: String,
      default: () => '请选择图标'
    },
    // icon 图标类型
    type: {
      type: String,
      default: () => 'ele'
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: () => false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: () => true
    },
    // 自定义空状态描述文字
    emptyDescription: {
      type: String,
      default: () => '无相关图标'
    },
    modelValue: String
  },
  setup(props, { emit }) {
    const inputWidthRef = ref()
    const state: any = reactive({
      fontIconPrefix: '',
      fontIconVisible: false,
      fontIconWidth: 0,
      fontIconSearch: '',
      fontIconTabsIndex: 0,
      fontIconSheetsList: [],
      fontIconPlaceholder: ''
    })
    // 处理 input 获取焦点时，modelValue 有值时，改变 input 的 placeholder 值
    const onIconFocus = () => {
      if (!props.modelValue) return false
      state.fontIconSearch = ''
      state.fontIconPlaceholder = props.modelValue
    }
    // 处理 input 失去焦点时，为空将清空 input 值，为点击选中图标时，将取原先值
    const onIconBlur = () => {
      setTimeout(() => {
        const icon = state.fontIconSheetsList.filter((icon: string) => icon === state.fontIconSearch)
        if (icon.length <= 0) state.fontIconSearch = ''
      }, 300)
    }
    // 处理 icon 双向绑定数值回显
    const initModeValueEcho = () => {
      if (props.modelValue === '') return false
      state.fontIconPlaceholder = props.modelValue
      state.fontIconPrefix = props.modelValue
    }
    // 图标搜索及图标数据显示
    const fontIconSheetsFilterList = computed(() => {
      if (!state.fontIconSearch) return state.fontIconSheetsList
      let search = state.fontIconSearch.trim()
      return state.fontIconSheetsList.filter((item: any) => {
        if (item.indexOf(search) !== -1) return item
      })
    })
    // 获取 input 的宽度
    const getInputWidth = () => {
      nextTick(() => {
        state.fontIconWidth = inputWidthRef.value.$el.offsetWidth
      })
    }
    // 监听页面宽度改变
    const initResize = () => {
      window.addEventListener('resize', () => {
        getInputWidth()
      })
    }
    // 初始化数据
    const initFontIconData = async () => {
      if (props.type === 'ele') {
        await initIconfont.ele().then((res: any) => {
          state.fontIconTabsIndex = 1
          state.fontIconSheetsList = res
        })
      }
      state.fontIconPlaceholder = props.placeholder
      initModeValueEcho()
    }
    // 获取当前点击的 icon 图标
    const onColClick = (v: any) => {
      state.fontIconPlaceholder = v
      state.fontIconVisible = false
      if (state.fontIconTabsIndex === 1) state.fontIconPrefix = `${v}`
      emit('get', state.fontIconPrefix)
      emit('update:modelValue', state.fontIconPrefix)
    }
    // 清空当前点击的 icon 图标
    const onClearFontIcon = () => {
      state.fontIconPrefix = ''
      emit('clear', state.fontIconPrefix)
      emit('update:modelValue', state.fontIconPrefix)
    }
    // 页面加载时
    onMounted(() => {
      initFontIconData()
      initResize()
      getInputWidth()
    })
    // 监听双向绑定 modelValue 的变化
    watch(
      () => props.modelValue,
      () => {
        initModeValueEcho()
      }
    )
    return {
      inputWidthRef,
      fontIconSheetsFilterList,
      onColClick,
      onClearFontIcon,
      onIconFocus,
      onIconBlur,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-selector {
  width: 100%;
}
.icon-selector-wrap {
  .icon-selector-wrap-row {
    margin-top: 5px;
    height: 225px;
    .icon-selector-wrap-item {
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>
