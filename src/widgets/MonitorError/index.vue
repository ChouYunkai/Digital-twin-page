<template>
  <WidgetPanel title="轴瓦异常监测">
    <BaseTable :columns="columns" :data="dataSource"></BaseTable>
  </WidgetPanel>
</template>

<script setup lang="ts">
import BaseTable from '@/components/BaseTable/index.vue'
import { reactive, onMounted, onUnmounted } from 'vue'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'
import WidgetPanel from '../WidgetPanel.vue'

// 表格列配置
const columns = [
  {
    title: '监测项目',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: '监测时间',
    dataIndex: 'time',
    width: '50%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '20%',
  },
]

// 生成异常监测数据
const generateInspectionData = () => {
  const { surfaceQuality } = bearingBushInspectionData
  const { defects } = surfaceQuality
  const inspectionItems = []

  // 表面缺陷检测
  if (defects.scratches) {
    inspectionItems.push({
      name: '表面划伤',
      time: new Date().toLocaleString(),
      status: '异常',
    })
  }
  if (defects.cracks) {
    inspectionItems.push({
      name: '裂纹检测',
      time: new Date().toLocaleString(),
      status: '异常',
    })
  }
  if (defects.pores) {
    inspectionItems.push({
      name: '气孔检测',
      time: new Date().toLocaleString(),
      status: '异常',
    })
  }
  if (defects.delamination) {
    inspectionItems.push({
      name: '分层检测',
      time: new Date().toLocaleString(),
      status: '异常',
    })
  }
  if (defects.deformation) {
    inspectionItems.push({
      name: '变形检测',
      time: new Date().toLocaleString(),
      status: '异常',
    })
  }
  if (defects.impurities) {
    inspectionItems.push({
      name: '杂质检测',
      time: new Date().toLocaleString(),
      status: '异常',
    })
  }

  // 如果所有缺陷都正常，显示正常状态
  if (inspectionItems.length === 0) {
    return [
      {
        name: '表面质量检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '材料成分检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '层间结合检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '装配可靠性检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '尺寸精度检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '硬度检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '力学性能检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
      {
        name: '摩擦学性能检测',
        time: new Date().toLocaleString(),
        status: '正常',
      },
    ]
  }

  return inspectionItems
}

// 数据源
const dataSource = reactive(generateInspectionData())

// 定时器更新时间
onMounted(() => {
  const interval = setInterval(() => {
    dataSource.forEach((item) => {
      item.time = new Date().toLocaleString()
    })
  }, 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
