<template>
  <WidgetPanel title="声音信号">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import Highcharts, { Options } from 'highcharts'
import boost from 'highcharts/modules/boost'
import { getMockChartData } from '@/utils/mockData'
import WidgetPanel from '../WidgetPanel.vue'

// 激活 Boost 模块以提高图表性能
boost(Highcharts)

// 禁用 UTC，使用本地时间
Highcharts.setOptions({
  time: {
    useUTC: false,
  },
})

// 常量
const UPDATE_INTERVAL = 1000
const INITIAL_POINTS = 20

// 创建图表数据
const generateInitialData = (data: [number, number][]): [number, number][] =>
  data.length
    ? data
    : Array.from({ length: INITIAL_POINTS }, (_, i) => {
        const time = new Date().getTime()
        return [time + i * 1000, Math.random()]
      })

// 更新图表的函数
const updateChart = (chart: Highcharts.Chart) => {
  const { series } = chart
  const [series0] = series

  const intervalId = setInterval(async () => {
    try {
      const response = await getMockChartData()
      const { adcData } = response
      const newPoint: [number, number] = [
        new Date().getTime(),
        adcData.series.find((s: { name: string }) => s.name === 'Channel1')
          ?.data[0] || 0,
      ]
      series0.addPoint(newPoint, true, true)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, UPDATE_INTERVAL)

  // 存储intervalId以便清理（如果需要的话，可以在组件卸载时清理）
  return intervalId
}

const chartContainer = ref<HTMLElement | null>(null)
let updateIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (chartContainer.value) {
    // 初始数据为空数组
    const initialData: [number, number][] = generateInitialData([])
    const chartOptions: Options = {
      chart: {
        type: 'spline',
        marginRight: 10,
        backgroundColor: 'transparent', // 图表背景设置为透明
        events: {
          load() {
            updateIntervalId = updateChart(this as Highcharts.Chart)
          },
        },
      },
      title: {
        text: null, // 禁用图表标题
      },
      credits: { enabled: false }, // 禁用图表版权信息
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        lineColor: '#FFFFFF', // X轴线的颜色
        tickColor: '#FFFFFF', // X轴刻度线的颜色
        labels: {
          style: {
            color: '#FFFFFF', // X轴标签文字的颜色
          },
        },
      },
      yAxis: {
        title: { text: null },
        lineColor: '#FFFFFF', // Y轴线的颜色
        tickColor: '#FFFFFF', // Y轴刻度线的颜色
        labels: {
          style: {
            color: '#FFFFFF', // Y轴标签文字的颜色
          },
        },
      },
      tooltip: {
        shared: false, // 确保tooltip只在鼠标悬停时显示
        formatter() {
          const seriesName = this.series.name || '未知系列'
          const formattedDate = Highcharts.dateFormat(
            '%Y-%m-%d %H:%M:%S',
            this.x as number
          )
          const formattedValue = Highcharts.numberFormat(this.y as number, 2)
          return `<b>${seriesName}</b><br/>${formattedDate}<br/>${formattedValue}`
        },
      },
      legend: { enabled: false },
      series: [
        {
          name: '频率',
          type: 'spline',
          data: initialData,
        },
      ],
    }
    Highcharts.chart(chartContainer.value as HTMLElement, chartOptions)
  }

  // 确保组件卸载时清除定时器
  onBeforeUnmount(() => {
    if (updateIntervalId !== null) {
      clearInterval(updateIntervalId)
    }
  })
})
</script>

<style lang="scss" scoped>
.widget-statistics-chart {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgb(11 101 140 / 26%),
    rgb(11 101 140 / 0%) 100%
  );
}
</style>
