<template>
  <WidgetPanel title="表面粗糙度监测">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { Options } from 'highcharts'
import boost from 'highcharts/modules/boost'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'
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
const UPDATE_INTERVAL = 2000
const INITIAL_POINTS = 60 // 增加初始点数，让线条看起来更长更连贯

// 【核心修改】定义一个变量来存储“当前的粗糙度值”，保证连续性
let currentRoughness = 0

/**
 * 【核心修改】平滑算法函数
 * @param prevValue 上一次的值
 * @param baseValue 目标基准值
 */
const getNextSmoothValue = (prevValue: number, baseValue: number) => {
  // 1. 产生一个微小的随机扰动 (幅度由 0.1 减小到 0.05，更精密)
  const noise = (Math.random() - 0.5) * 0.05 * baseValue

  // 2. 模拟长周期漂移 (可选，这里简化为趋向基准值)
  const target = baseValue + noise

  // 3. 惯性计算：保留 80% 的上一次值，只接受 20% 的新变化
  // 这里的 0.8 是“惯性系数”，越大曲线越平滑
  return prevValue * 0.8 + target * 0.2
}

// 创建初始图表数据
const generateInitialData = (baseValue: number): [number, number][] => {
  const data: [number, number][] = []
  const now = new Date().getTime()

  // 初始化起始值
  currentRoughness = baseValue

  // 从过去向现在生成数据
  for (let i = INITIAL_POINTS; i >= 0; i -= 1) {
    const time = now - i * UPDATE_INTERVAL
    // 更新全局的 currentRoughness，确保连续
    currentRoughness = getNextSmoothValue(currentRoughness, baseValue)
    data.push([time, currentRoughness])
  }
  return data
}

// 更新图表的函数
const updateChart = (chart: Highcharts.Chart, baseValue: number) => {
  const { series } = chart
  const [series0] = series

  setInterval(() => {
    // 基于上一次的 currentRoughness 继续演进
    currentRoughness = getNextSmoothValue(currentRoughness, baseValue)

    const newPoint: [number, number] = [new Date().getTime(), currentRoughness]
    series0.addPoint(newPoint, true, true)
  }, UPDATE_INTERVAL)
}

const chartContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (chartContainer.value) {
    const baseValue = parseFloat(
      bearingBushInspectionData.surfaceQuality.roughness.value
    )

    // 生成初始数据
    const initialData: [number, number][] = generateInitialData(baseValue)

    const chartOptions: Options = {
      chart: {
        type: 'spline', // 使用样条曲线，本身就会在点之间进行平滑插值
        marginRight: 10,
        backgroundColor: 'transparent',
        events: {
          load() {
            updateChart(this as Highcharts.Chart, baseValue)
          },
        },
      },
      title: { text: null },
      credits: { enabled: false },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        lineColor: '#FFFFFF',
        tickColor: '#FFFFFF',
        labels: {
          style: { color: '#FFFFFF' },
        },
      },
      yAxis: {
        title: {
          text: 'Ra (μm)',
          style: { color: '#FFFFFF' },
        },
        lineColor: '#FFFFFF',
        tickColor: '#FFFFFF',
        gridLineColor: 'rgba(255,255,255,0.1)', // 增加淡淡的网格线
        labels: {
          style: { color: '#FFFFFF' },
        },
        // 移除固定的 min/max，或者设置 softMin/softMax 让图表呼吸感更强
        plotLines: [
          {
            value: baseValue,
            color: '#fbbf24',
            dashStyle: 'ShortDash',
            width: 2,
            zIndex: 5,
            label: {
              text: `标准: ${baseValue}`,
              align: 'right',
              style: { color: '#fbbf24', fontSize: '10px' },
            },
          },
        ],
      },
      tooltip: {
        shared: false,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: { color: '#fff' },
        valueDecimals: 3, // 锁定显示3位小数
        headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b> μm',
      },
      legend: {
        enabled: true,
        itemStyle: { color: '#FFFFFF', fontWeight: 'normal' },
      },
      series: [
        {
          name: '表面粗糙度 Ra',
          type: 'spline',
          data: initialData,
          color: '#60a5fa',
          lineWidth: 2,
          marker: {
            enabled: false, // 隐藏数据点的小圆圈，让线条更像连续的波形
            states: {
              hover: { enabled: true },
            },
          },
        },
      ],
    }
    Highcharts.chart(chartContainer.value as HTMLElement, chartOptions)
  }
})
</script>

<style lang="scss" scoped>
.widget-statistics-chart {
  width: 100%;
  height: 100%;

  /* 调整渐变背景，使其更柔和 */
  background: linear-gradient(
    to top,
    rgb(11 101 140 / 20%),
    rgb(11 101 140 / 0%) 100%
  );
}
</style>
