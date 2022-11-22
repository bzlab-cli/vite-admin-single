<template>
  <div :class="{ 'has-logo': showLogo }" class="sideWrap">
    <SidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="!isCollapse"
        :unique-opened="false"
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        mode="vertical"
      >
        <SidebarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import SidebarItem from './sidebar-item.vue'
import SidebarLogo from './sidebar-logo.vue'
import variables from '@/styles/variables.module.scss'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useSettingsStore } from '@/store/modules/settings'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    SidebarItem,
    SidebarLogo
  },
  setup() {
    const appStore = useAppStore()
    const permissionStore = usePermissionStore() as any
    const settingsStore = useSettingsStore()
    const route = useRoute()
    const sidebar = computed(() => {
      return appStore.sidebar
    })
    const routes = computed(() => {
      return permissionStore.routes
    })

    const showLogo = computed(() => {
      return settingsStore.showSidebarLogo
    })

    const menuActiveTextColor = computed(() => {
      if (settingsStore.sidebarTextTheme) {
        return '#57CAEB'
        // return settingsStore.theme
      } else {
        return variables.menuActiveText
      }
    })

    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta !== null || meta !== undefined) {
        if (meta.activeMenu) {
          return meta.activeMenu
        }
      }
      return path
    })

    const isCollapse = computed(() => {
      return sidebar.value.opened
    })

    return {
      sidebar,
      routes,
      showLogo,
      menuActiveTextColor,
      variables,
      activeMenu,
      isCollapse
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  .el-menu {
    border: none;
  }
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>
