<template>
  <WidgetPanel title="轴瓦指标趋势">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { Options } from 'highcharts'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'
import WidgetPanel from '../WidgetPanel.vue'

// 创建一个 ref 来引用 DOM 元素
const chartContainer = ref<HTMLElement | null>(null)

// 生成历史趋势数据
const generateTrendData = (baseValue: number, days: number = 30) => {
  const data: [number, number][] = []
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000

  for (let i = days; i >= 0; i -= 1) {
    const time = now - i * oneDay
    // 在基础值附近添加小幅波动，模拟历史趋势
    const variation = (Math.random() - 0.5) * 0.15 * baseValue
    const trend = Math.sin(i / 10) * 0.05 * baseValue // 添加趋势波动
    data.push([time, baseValue + variation + trend])
  }
  return data
}

// 在组件挂载时初始化 Highcharts 图表
onMounted(() => {
  if (chartContainer.value) {
    const data = bearingBushInspectionData

    // 图表的配置选项
    const options: Options = {
      credits: { enabled: false },
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
      },
      boost: {
        useGPUTranslations: true,
      },
      title: false,
      xAxis: {
        type: 'datetime',
        lineColor: '#FFFFFF',
        tickColor: '#FFFFFF',
        labels: {
          style: {
            color: '#FFFFFF',
          },
        },
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%m-%d',
          week: '%m-%d',
          month: '%Y-%m',
          year: '%Y',
        },
      },
      tooltip: {
        shared: true,
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%Y-%m-%d',
          week: '%m-%d',
          month: '%Y-%m',
          year: '%Y',
        },
      },
      yAxis: {
        lineColor: '#FFFFFF',
        tickColor: '#FFFFFF',
        labels: {
          style: {
            color: '#FFFFFF',
          },
        },
        title: {
          text: null,
        },
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: '#fff',
          fontSize: '10px', // 1. 减小字体大小 (原 14px)
          fontWeight: 'normal', // 可选：去掉加粗让其视觉更轻
        },
        itemDistance: 10, // 2. 减小图例项之间的水平间距
        symbolHeight: 8, // 3. 减小图例图标高度
        symbolWidth: 8, // 3. 减小图例图标宽度
        symbolRadius: 2, // 圆角
        margin: 5, // 4. 减小图例与绘图区之间的间距
        padding: 0, // 5. 减小图例容器内边距
        itemMarginTop: 0, // 减小项的上边距
        itemMarginBottom: 0, // 减小项的下边距
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, Highcharts.getOptions().colors?.[0] as string],
              [
                1,
                Highcharts.color(Highcharts.getOptions().colors?.[0] || '')
                  .setOpacity(0)
                  .get('rgba') as string,
              ],
            ],
          },
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 2,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          type: 'area',
          name: '疲劳强度 (MPa)',
          data: generateTrendData(
            parseFloat(data.mechanicalProperties.fatigueStrength.value)
          ),
          color: '#60a5fa',
        },
        {
          type: 'area',
          name: '抗压强度 (MPa)',
          data: generateTrendData(
            parseFloat(data.mechanicalProperties.compressiveStrength.value) / 4
          ), // 缩放以便在同一图表显示
          color: '#34d399',
        },
        {
          type: 'area',
          name: '层间结合强度 (MPa)',
          data: generateTrendData(
            parseFloat(data.materialComposition.bondingStrength.value)
          ),
          color: '#fbbf24',
        },
      ],
    }
    // 渲染图表到 chartContainer 所指向的 DOM 元素
    Highcharts.chart(chartContainer.value as HTMLElement, options)
  }
})
</script>

<style lang="scss" scoped>
.widget-statistics-chart {
  width: 100%; // 宽度占满容器
  height: 100%; // 高度占满容器
  background: linear-gradient(
    to top,
    rgb(11 101 140 / 26%) 0%,
    rgb(11 101 140 / 0%) 100%
  );
}
</style>
