<template>
  <WidgetPanel title="轴瓦检测状态">
    <div ref="container" class="widget-safty"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'
import WidgetPanel from '../WidgetPanel.vue'

// 初始化 3D 高图表插件
highcharts3d(highcharts)

const container = ref<HTMLElement | null>(null)

// 计算检测状态分布
const statusDistribution = computed(() => {
  const data = bearingBushInspectionData
  let qualified = 0
  let unqualified = 0

  const checkStatus = (status: '合格' | '不合格') => {
    if (status === '合格') qualified += 1
    else unqualified += 1
  }

  // --- 统计逻辑保持不变 ---
  // 尺寸精度
  checkStatus(data.dimensionalTolerances.wallThickness.status)
  checkStatus(data.dimensionalTolerances.outerDiameter.status)
  checkStatus(data.dimensionalTolerances.roundness.status)
  checkStatus(data.dimensionalTolerances.concentricity.status)
  checkStatus(data.dimensionalTolerances.width.status)
  checkStatus(data.dimensionalTolerances.lockGrooveSize.status)
  // 表面质量
  checkStatus(data.surfaceQuality.roughness.status)
  checkStatus(data.surfaceQuality.defects.status)
  // 材料成分
  checkStatus(data.materialComposition.chemicalComposition.tin.status)
  checkStatus(data.materialComposition.chemicalComposition.lead.status)
  checkStatus(data.materialComposition.chemicalComposition.copper.status)
  checkStatus(data.materialComposition.chemicalComposition.aluminum.status)
  checkStatus(data.materialComposition.layerThickness.status)
  checkStatus(data.materialComposition.bondingStrength.status)
  // 硬度
  checkStatus(data.hardness.steelBack.status)
  checkStatus(data.hardness.copperBase.status)
  checkStatus(data.hardness.alloyLayer.status)
  // 力学性能
  checkStatus(data.mechanicalProperties.fatigueStrength.status)
  checkStatus(data.mechanicalProperties.compressiveStrength.status)
  // 摩擦学性能
  checkStatus(data.tribologicalPerformance.frictionCoefficient.status)
  checkStatus(data.tribologicalPerformance.pvLimit.status)
  checkStatus(data.tribologicalPerformance.wearRate.status)
  // 配合与装配
  checkStatus(data.fitAndAssembly.radialClearance.mainBearing.status)
  checkStatus(data.fitAndAssembly.radialClearance.connectingRod.status)
  checkStatus(data.fitAndAssembly.assemblyReliability.status)

  const total = qualified + unqualified
  return {
    qualified: Math.round((qualified / total) * 100),
    unqualified: Math.round((unqualified / total) * 100),
    total,
  }
})

onMounted(() => {
  if (container.value) {
    const distribution = statusDistribution.value

    const options: any = {
      credits: { enabled: false },
      chart: {
        type: 'pie',
        backgroundColor: 'rgba(0,0,0,0)',
        // 【优化点1】调整 3D 视角，不要太倾斜，让圆环看起来更饱满
        options3d: {
          enabled: true,
          alpha: 45, // 倾斜角度：45度通常最自然
          beta: 0,
        },
        // 增加边距，防止3D图表被切断
        marginTop: 0,
        marginBottom: 20,
        height: '48%',
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle', // 图例垂直居中
        layout: 'vertical', // 垂直排列图例
        itemStyle: {
          color: '#fff',
          fontSize: '12px', // 字体适中
          fontWeight: 'normal',
        },
        itemMarginBottom: 10,
        symbolRadius: 0, // 方形图标更符合工业感
      },
      title: { text: null },
      plotOptions: {
        pie: {
          // 【优化点2】核心修改：减小内径，增加圆环厚度
          // '40%' 表示内孔直径占图表的 40%，剩下的空间就是圆环
          innerSize: '40%',
          center: ['40%', '50%'],
          // 【优化点3】调整深度，配合新的厚度
          depth: 30,

          allowPointSelect: true,
          cursor: 'pointer',
          // 稍微将切片分离一点点，增加精致感
          slicedOffset: 10,

          dataLabels: {
            enabled: true, // 开启标签，但只显示百分比
            format: '{point.y}%',
            distance: 15, // 标签距离圆环的距离
            style: {
              color: '#ffffff',
              fontSize: '11px',
              textOutline: 'none', // 去掉文字描边，更清晰
            },
            connectorColor: 'rgba(255,255,255,0.3)', // 连接线颜色变淡
          },
          showInLegend: true,
          borderWidth: 0, // 去掉切片边框
        },
      },
      series: [
        {
          name: '检测状态',
          // 显式指定颜色和数据对象结构，更稳定
          data: [
            {
              name: '合格',
              y: distribution.qualified,
              color: '#34d399',
              sliced: true, // 默认突出显示“合格”或者最大的那块
              selected: true,
            },
            {
              name: '不合格',
              y: distribution.unqualified,
              color: '#f87171',
            },
          ],
        },
      ],
    }
    highcharts.chart(container.value, options)
  }
})
</script>

<style lang="scss" scoped>
.widget-safty {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
