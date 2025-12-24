<template>
  <!-- WidgetPanel 是自定义组件，“声音震动信号”是面板的标题。图表将渲染在一个有 `container` 引用的 div 中。 -->
  <WidgetPanel title="运行状态">
    <div ref="container" class="widget-safty"></div>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
import WidgetPanel from '../WidgetPanel.vue'

// 初始化 3D 高图表插件
highcharts3d(highcharts)

// 使用 ref 创建一个引用，来引用 DOM 元素
const container = ref()

// 在组件挂载时调用，初始化图表
onMounted(() => {
  // 图表的配置选项
  const options: any = {
    credits: { enabled: false }, // 禁用图表版权信息
    chart: {
      type: 'pie', // 图表类型为饼图
      backgroundColor: 'rgba(0,0,0,0)', // 背景颜色为透明
      options3d: {
        enabled: true, // 启用 3D 功能
        alpha: 50, // 设置 3D 图表的倾斜角度
      },
    },
    legend: {
      align: 'center', // 图例对齐方式
      verticalAlign: 'bottom', // 图例垂直对齐方式
      layout: 'horizontal', // 水平布局
      itemStyle: {
        color: '#fff', // 图例文本颜色
        fontSize: '12px', // 图例字体大小
        lineHeight: '20px', // 图例行高
      },
      itemMarginBottom: 5, // 图例项之间的间距
    },
    title: false, // 禁用图表标题
    plotOptions: {
      pie: {
        innerSize: 50, // 设置饼图的内径大小
        depth: 40, // 设置饼图的深度
        allowPointSelect: true, // 允许选择点
        cursor: 'pointer', // 鼠标悬停时显示指针
        dataLabels: {
          enabled: false, // 禁用数据标签
        },
        showInLegend: true, // 在图例中显示
      },
    },
    series: [
      {
        name: '时长', // 系列名称
        data: [
          ['停机维护', 24], // 数据项：标签和值
          ['故障维护', 16],
          ['正常运行', 87],
          ['保养维护', 3],
        ],
      },
    ],
  }
  // 渲染图表到 container 所指向的 DOM 元素
  highcharts.chart(container.value, options)
})
</script>

<style lang="scss" scoped>
/* 定义 widget-safty 类的样式 */
.widget-safty {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
