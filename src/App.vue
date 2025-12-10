<template>
  <!-- Layout 组件作为主要容器 -->
  <Layout>
    <!-- BaseTurbine 组件可能代表涡轮布局或视觉元素 -->
    <BaseTurbine>
      <!-- 左侧组件插槽 -->
      <template #left>
        <!-- 基于 chunkModules.left 中的项，动态渲染 Witgets 对象中的组件 -->
        <component
          :is="Witgets[item]"
          v-for="item in chunkModules.left"
          :key="item"
        />
      </template>

      <!-- 右侧组件插槽 -->
      <template #right>
        <!-- 基于 chunkModules.right 中的项，动态渲染 Witgets 对象中的组件 -->
        <component
          :is="Witgets[item]"
          v-for="item in chunkModules.right"
          :key="item"
        />
      </template>

      <!-- 控制面板插槽 -->
      <template #control>
        <!-- 渲染 Witgets 对象中的 ControlPanel 和 ControlTurbine 组件 -->
        <Witgets.ControlPanel></Witgets.ControlPanel>
        <Witgets.ControlTurbine></Witgets.ControlTurbine>
      </template>
    </BaseTurbine>

    <!-- World 组件可能是一个代表整个应用或特定场景的组件 -->
    <template>
      <World />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/layout/index.vue' // 导入 Layout 组件
import { useLayoutStore } from '@/stores/modules/layout' // 导入布局状态管理
import { storeToRefs } from 'pinia' // 从 Pinia 中导入 storeToRefs 方法
import BaseTurbine from '@/components/BaseTurbine/index.vue' // 导入 BaseTurbine 组件
import Witgets from './widgets' // 导入 Witgets 组件集合

// 从布局状态管理中解构出 chunkModules
const { chunkModules } = storeToRefs(useLayoutStore())
</script>
