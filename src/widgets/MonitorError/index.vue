<template>
  <WidgetPanel title="异常监测">
    <BaseTable :columns="columns" :data="dataSource"></BaseTable>
  </WidgetPanel>
</template>

<script setup lang="ts">
import BaseTable from '@/components/BaseTable/index.vue'
import { reactive, onMounted, onUnmounted } from 'vue'
import WidgetPanel from '../WidgetPanel.vue'

// 表格列配置
const columns = [
  {
    title: '监测项目',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: '监测时间',
    dataIndex: 'time',
    width: '55%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '20%',
  },
]

// 数据源
const dataSource = reactive([
  {
    name: '阻力齿轮',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '连接件1',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '风扇',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '连杆机构',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '主轴',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '传送带',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '叶片',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
  {
    name: '发电机',
    time: new Date().toLocaleString(),
    status: '可疑',
  },
])

// 定时器更新时间
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    dataSource.forEach((item) => {
      item.time = new Date().toLocaleString()
    })
  }, 1000) // 每秒更新一次
})

onUnmounted(() => {
  if (interval !== null) {
    clearInterval(interval)
  }
})
</script>
