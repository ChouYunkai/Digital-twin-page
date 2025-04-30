<template>
  <WidgetPanel title="4通道震动信号">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { Options, SeriesLineOptions } from 'highcharts'
import boost from 'highcharts/modules/boost'
import axios from 'axios'
import WidgetPanel from '../WidgetPanel.vue'

// 激活 Boost 模块以提高图表性能
boost(Highcharts)

// 创建一个 ref 来引用 DOM 元素
const chartContainer = ref<HTMLElement | null>(null)
let chart: Highcharts.Chart | null = null

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/chart-data')
    const data = response.data.adcData

    // 明确指定系列的类型
    const seriesData: Array<SeriesLineOptions> = [
      { name: 'Channel2', data: data.series.find((s: { name: string }) => s.name === 'Channel2')?.data || [], type: 'line' },
      { name: 'Channel3', data: data.series.find((s: { name: string }) => s.name === 'Channel3')?.data || [], type: 'line' },
      { name: 'Channel4', data: data.series.find((s: { name: string }) => s.name === 'Channel4')?.data || [], type: 'line' },
      { name: 'Channel5', data: data.series.find((s: { name: string }) => s.name === 'Channel5')?.data || [], type: 'line' }
    ]

    if (chartContainer.value) {
      if (chart) {
        // 更新已有图表的数据
        chart.update({
          series: seriesData
        }, true, true)
      } else {
        // 图表的配置选项
        const options: Options = {
          credits: { enabled: false },
          chart: {
            type: 'line',
            backgroundColor: 'transparent'
          },
          boost: {
            useGPUTranslations: true
          },
          title: {
            text: undefined
          },
          xAxis: {
            title: {
              text: undefined
            },
            lineColor: '#FFFFFF',
            tickColor: '#FFFFFF',
            labels: {
              style: {
                color: '#FFFFFF'
              }
            }
          },
          yAxis: {
            title: {
              text: undefined
            },
            lineColor: '#FFFFFF',
            tickColor: '#FFFFFF',
            labels: {
              style: {
                color: '#FFFFFF'
              }
            }
          },
          tooltip: {
            valueDecimals: 2
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#FFFFFF'
            },
            itemHoverStyle: {
              color: '#CCCCCC'
            }
          },
          series: seriesData
        }
        // 创建图表
        chart = Highcharts.chart(chartContainer.value, options)
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// 在组件挂载时初始化 Highcharts 图表
onMounted(() => {
  fetchData()
  // 每秒更新一次数据
  setInterval(fetchData, 1000)
})
</script>

<style lang="scss" scoped>
.widget-statistics-chart {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgb(11 101 140 / 26%) 0%, rgb(11 101 140 / 0%) 100%);
}
</style>
