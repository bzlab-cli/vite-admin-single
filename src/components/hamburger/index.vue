<template>
  <div :class="[{ 'is-active': isActive }]" @click="toggleClick">
    <el-icon :size="20"><Expand /></el-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-click'],
  setup(_, context) {
    const toggleClick = () => {
      context.emit('toggle-click')
    }
    return {
      toggleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.el-icon {
  vertical-align: middle;
  color: #333;
}

.is-active {
  transform: rotate(180deg);
}
</style>
