<template>
  <!-- WidgetPanel 是自定义组件，标题为“统计图表”，图表将渲染在一个有 `chartContainer` 引用的 div 中。 -->
  <WidgetPanel title="统计图表">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { Options } from 'highcharts'
import WidgetPanel from '../WidgetPanel.vue'

// 创建一个 ref 来引用 DOM 元素
const chartContainer = ref<HTMLElement | null>(null)

// 在组件挂载时初始化 Highcharts 图表
onMounted(() => {
  if (chartContainer.value) {
    // 图表的配置选项
    const options: Options = {
      credits: { enabled: false }, // 禁用图表版权信息
      chart: {
        type: 'area',
        backgroundColor: 'transparent', // 图表背景设置为透明
        // zoomType: 'x', // 启用 x 轴缩放
      },
      boost: {
        useGPUTranslations: true // 启用 GPU 加速
      },
      title: false, // 禁用图表标题
      xAxis: {
        type: 'datetime',
        lineColor: '#FFFFFF', // X轴线的颜色
        tickColor: '#FFFFFF', // X轴刻度线的颜色
        labels: {
          style: {
            color: '#FFFFFF' // X轴标签文字的颜色
          }
        },
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%m-%d',
          week: '%m-%d',
          month: '%Y-%m',
          year: '%Y'
        }
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
          year: '%Y'
        }
      },
      yAxis: {
        lineColor: '#FFFFFF', // Y轴线的颜色
        tickColor: '#FFFFFF', // Y轴刻度线的颜色
        labels: {
          style: {
            color: '#FFFFFF' // Y轴标签文字的颜色
          }
        },
        title: {
          text: null
        }
      },
      legend: {
        enabled: false,
        itemStyle: {
          color: '#fff', // 图例文本颜色
          fontSize: '14px', // 图例字体大小
          lineHeight: '30px' // 图例行高
        }
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, Highcharts.getOptions().colors?.[0] as string],
              [1, Highcharts.color(Highcharts.getOptions().colors?.[0] || '').setOpacity(0).get('rgba') as string]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'area',
        name: '美元兑欧元',
        data: [
          [Date.UTC(2022, 0, 1), 1.2],
          [Date.UTC(2022, 0, 2), 1.25],
          [Date.UTC(2022, 0, 3), 1.3],
          // 添加更多数据点
        ]
      }]
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
  background: linear-gradient(to top, rgb(11 101 140 / 26%) 0%, rgb(11 101 140 / 0%) 100%);
}
</style>
