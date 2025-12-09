<template>
  <div ref="container" class="base-bearing-bush">
    <div v-if="loading" class="loading">
      <IconLoading spin class="icon" />
      <span>轴瓦模型加载中,请耐心等待...</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IconLoading } from '@arco-design/web-vue/es/icon'
import { useBearingBush } from './hooks/useBearingBush'

const { container, loading, inspectionData } = useBearingBush()

// 暴露检测数据，供外部使用
defineExpose({
  inspectionData,
})
</script>
<style lang="scss" scoped>
.base-bearing-bush {
  position: relative;
  width: 100%;
  height: 100%;

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 20px;
    color: #fff;

    .icon {
      margin-bottom: 10px;
      font-size: 26px;
    }
  }
}
</style>
