<template>
  <!-- WidgetPanel 是自定义组件，“发电监测”是面板的标题。图表将渲染在一个有 `chartContainer` 引用的 div 中。 -->
  <WidgetPanel title="发电监测">
    <div ref="chartContainer" class="widget-statistics-chart"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { Options } from 'highcharts'
import boost from 'highcharts/modules/boost'
import WidgetPanel from '../WidgetPanel.vue'

// 激活 Boost 模块以提高图表性能
boost(Highcharts)

// 数据生成函数
function getData(n: number) {
  const arr: [number, number][] = [] // 使用明确的数组类型
  let a = 0
  let b = 0
  let c = 0
  let spike = 0

  for (let i = 0; i < n; i += 1) {
    // 根据不同的条件随机调整变量的值
    if (i % 100 === 0) {
      a = 2 * Math.random()
    }
    if (i % 1000 === 0) {
      b = 2 * Math.random()
    }
    if (i % 10000 === 0) {
      c = 2 * Math.random()
    }
    if (i % 50000 === 0) {
      spike = 10
    } else {
      spike = 0
    }
    // 将生成的数据添加到数组中
    arr.push([i, 2 * Math.sin(i / 100) + a + b + c + spike + Math.random()])
  }
  return arr
}

const n = 500000
const data = getData(n)

// 创建一个 ref 来引用 DOM 元素
const chartContainer = ref<HTMLElement | null>(null)

// 在组件挂载时初始化 Highcharts 图表
onMounted(() => {
  if (chartContainer.value) {
    console.time('line')
    // 图表的配置选项
    const options: Options = {
      credits: { enabled: false }, // 禁用图表版权信息
      chart: {
        type: 'line', // 图表类型为折线图
        backgroundColor: 'rgba(11, 101, 140, 0.26)' // 背景颜色为透明
      },
      boost: {
        useGPUTranslations: true // 启用 GPU 加速
      },
      title: false, // 禁用图表标题
    //   title: {
    //     text: `声音震动 ${n} 信号`, // 图表标题
    //     style: {
    //       color: '#fff', // 图例文本颜色
    //       fontSize: '14px', // 图例字体大小
    //   fontWeight: 'bold',// 设置字体加粗
    //   lineHeight: '30px', // 图例行高
    // }
      // },
    //   legend: {
    //   align: 'right', // 图例对齐方式
    //   verticalAlign: 'top', // 图例垂直对齐方式
    //   itemStyle: {
    //     color: '#fff', // 图例文本颜色
    //     fontSize: '14px', // 图例字体大小
    //     lineHeight: '30px', // 图例行高
    //   },
    // },
      plotOptions: {
      pie: {
        innerSize: 50, // 设置图的内径大小
        depth: 40, // 设置图的深度
        allowPointSelect: true, // 允许选择点
        cursor: 'pointer', // 鼠标悬停时显示指针
        dataLabels: {
          enabled: false, // 禁用数据标签
        },
        showInLegend: true, // 在图例中显示
      },
    },
    //   subtitle: {
    //     text: '副标题', // 图表副标题
    //     style: {
    //       color: '#fff', // 图例文本颜色
    //       fontSize: '14px', // 图例字体大小
    //   fontWeight: 'bold',// 设置字体加粗
    //   lineHeight: '30px', // 图例行高
    // }
    //   },
      tooltip: {
        valueDecimals: 2 // 工具提示中的值保留两位小数
      },
      series: [{
        type: 'line', // 系列类型为折线图
        data, // 图表数据
        lineWidth: 0.5 // 线宽
      }]
    }
    // 渲染图表到 chartContainer 所指向的 DOM 元素
    Highcharts.chart(chartContainer.value, options)
    console.timeEnd('line')
  }
})
</script>

<style lang="scss" scoped>
.widget-statistics-chart {
  width: 100%; // 宽度占满容器
  height: 100%; // 高度占满容器
}
</style>
