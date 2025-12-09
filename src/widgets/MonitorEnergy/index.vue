<template>
  <WidgetPanel title="轴瓦尺寸精度监测">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { Options, SeriesLineOptions } from 'highcharts'
import boost from 'highcharts/modules/boost'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'
import WidgetPanel from '../WidgetPanel.vue'

// 激活 Boost 模块以提高图表性能
boost(Highcharts)

// 创建一个 ref 来引用 DOM 元素
const chartContainer = ref<HTMLElement | null>(null)
let chart: Highcharts.Chart | null = null

// 生成模拟时间序列数据
const generateTimeSeriesData = (baseValue: number) => {
  const data: [number, number][] = []
  const now = Date.now()
  for (let i = 0; i < 50; i += 1) {
    const time = now - (50 - i) * 1000
    // 在基础值附近添加小幅波动
    const variation = (Math.random() - 0.5) * 0.1 * baseValue
    data.push([time, parseFloat(baseValue.toString()) + variation])
  }
  return data
}

const initChart = () => {
  if (!chartContainer.value) return

  const dim = bearingBushInspectionData.dimensionalTolerances

  // 生成4个尺寸精度指标的模拟数据
  const seriesData: Array<SeriesLineOptions> = [
    {
      name: '壁厚 (mm)',
      data: generateTimeSeriesData(parseFloat(dim.wallThickness.value)),
      type: 'line',
      color: '#60a5fa',
    },
    {
      name: '外径 (mm)',
      data: generateTimeSeriesData(parseFloat(dim.outerDiameter.value)),
      type: 'line',
      color: '#34d399',
    },
    {
      name: '圆度 (μm)',
      data: generateTimeSeriesData(parseFloat(dim.roundness.value)),
      type: 'line',
      color: '#fbbf24',
    },
    {
      name: '同心度 (μm)',
      data: generateTimeSeriesData(parseFloat(dim.concentricity.value)),
      type: 'line',
      color: '#f87171',
    },
  ]

  // 图表的配置选项
  const options: Options = {
    credits: { enabled: false },
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
    },
    boost: {
      useGPUTranslations: true,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: undefined,
      },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      labels: {
        style: {
          color: '#FFFFFF',
        },
      },
    },
    yAxis: {
      title: {
        text: undefined,
      },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      labels: {
        style: {
          color: '#FFFFFF',
        },
      },
    },
    tooltip: {
      valueDecimals: 3,
      shared: true,
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: '#FFFFFF',
      },
      itemHoverStyle: {
        color: '#CCCCCC',
      },
    },
    series: seriesData,
  }

  // 创建图表
  chart = Highcharts.chart(chartContainer.value, options)

  // 模拟实时更新数据
  setInterval(() => {
    if (chart) {
      const now = Date.now()
      chart.series.forEach((series, index) => {
        const baseValues = [
          parseFloat(dim.wallThickness.value),
          parseFloat(dim.outerDiameter.value),
          parseFloat(dim.roundness.value),
          parseFloat(dim.concentricity.value),
        ]
        const variation = (Math.random() - 0.5) * 0.1 * baseValues[index]
        const newValue = baseValues[index] + variation
        series.addPoint([now, newValue], true, true)
      })
    }
  }, 2000)
}

// 在组件挂载时初始化 Highcharts 图表
onMounted(() => {
  initChart()
})
</script>

<style lang="scss" scoped>
.widget-statistics-chart {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgb(11 101 140 / 26%) 0%,
    rgb(11 101 140 / 0%) 100%
  );
}
</style>
