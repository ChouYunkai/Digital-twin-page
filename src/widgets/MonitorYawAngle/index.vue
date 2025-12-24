<template>
  <!-- WidgetPanel 是自定义组件，标题为“统计图表”，图表将渲染在一个有 `chartContainer` 引用的 div 中。 -->
  <WidgetPanel title="统计图表">
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

// 创建一个 ref 来引用 DOM 元素
const chartContainer = ref<HTMLElement | null>(null)
let chart: Highcharts.Chart | null = null

// 获取数据并更新图表
const fetchData = async () => {
  try {
    const response = await getMockChartData()
    const { adcData } = response

    // 使用Channel1的数据作为统计图表的数据源
    const channel1Data =
      adcData.series.find((s: { name: string }) => s.name === 'Channel1')
        ?.data || []

    // 生成时间序列数据
    const now = Date.now()
    const timeSeriesData: [number, number][] = channel1Data.map(
      (value: number, index: number) => [
        now - (channel1Data.length - index) * 1000, // 每秒一个数据点
        value,
      ]
    )

    if (chartContainer.value) {
      if (chart) {
        // 更新已有图表的数据
        chart.series[0].setData(timeSeriesData, true, true)
      } else {
        // 图表的配置选项
        const options: Options = {
          credits: { enabled: false }, // 禁用图表版权信息
          chart: {
            type: 'area',
            backgroundColor: 'transparent', // 图表背景设置为透明
          },
          boost: {
            useGPUTranslations: true, // 启用 GPU 加速
          },
          title: false, // 禁用图表标题
          xAxis: {
            type: 'datetime',
            lineColor: '#FFFFFF', // X轴线的颜色
            tickColor: '#FFFFFF', // X轴刻度线的颜色
            labels: {
              style: {
                color: '#FFFFFF', // X轴标签文字的颜色
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
            lineColor: '#FFFFFF', // Y轴线的颜色
            tickColor: '#FFFFFF', // Y轴刻度线的颜色
            labels: {
              style: {
                color: '#FFFFFF', // Y轴标签文字的颜色
              },
            },
            title: {
              text: null,
            },
          },
          legend: {
            enabled: false,
            itemStyle: {
              color: '#fff', // 图例文本颜色
              fontSize: '14px', // 图例字体大小
              lineHeight: '30px', // 图例行高
            },
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
                  lineWidth: 1,
                },
              },
              threshold: null,
            },
          },
          series: [
            {
              type: 'area',
              name: '统计数据',
              data: timeSeriesData,
            },
          ],
        }
        // 渲染图表到 chartContainer 所指向的 DOM 元素
        chart = Highcharts.chart(chartContainer.value as HTMLElement, options)
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
  const intervalId = setInterval(fetchData, 1000)

  // 确保组件卸载时清除定时器
  onBeforeUnmount(() => clearInterval(intervalId))
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
