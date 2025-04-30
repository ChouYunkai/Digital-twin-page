<template>
  <WidgetPanel title="参数监测">
    <ul class="widget-rain">
      <li class="rain-item normal">
        <span class="label">输出电流</span>
        <span class="value">{{ data.Channel1 / 100 }}</span>
        <span class="unit">An</span>
      </li>
      <li class="rain-item normal">
        <span class="label">计数值</span>
        <span class="value">{{ data.Channel2 }}</span>
        <span class="unit">R</span>
      </li>
      <li class="rain-item normal">
        <span class="label">输出频率</span>
        <span class="value">{{ data.Channel3 }}</span>
        <span class="unit">Hz</span>
      </li>
      <li class="rain-item normal">
        <span class="label">输出电压值</span>
        <span class="value">{{ data.Channel5 / 10 }}</span>
        <span class="unit">V</span>
      </li>
      <li class="rain-item warning">
        <img class="icon" :src="alarm" />
        <span class="label">输出功率</span>
        <span class="value">{{ data.Channel7 / 10 }}</span>
        <span class="unit">kW</span>
      </li>
      <li class="rain-item warning">
        <img class="icon" :src="alarm" />
        <span class="label">变频器状态</span>
        <span class="value">{{ data.InverterStatus }}</span>
        <!-- <span class="unit"></span> -->
      </li>
      <li class="rain-item warning">
        <img class="icon" :src="alarm" />
        <span class="label">马达实际速度</span>
        <span class="value">{{ data.Channel8 }}</span>
        <span class="unit">rPm</span>
      </li>
      <li class="rain-item">
        <img class="icon" :src="alarm" />
        <span class="label">输出转矩</span>
        <span class="value">{{ data.Channel9 }}</span>
        <span class="unit">%</span>
      </li>
    </ul>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import alarm from '@/assets/icons/alarm.png';
import WidgetPanel from '../WidgetPanel.vue';

// 数据类型定义
interface Series {
  name: string;
  data: number[];
}

// 响应式数据
const data = ref({
  Channel1: 0,
  Channel2: 0,
  Channel3: 0,
  Channel5: 0,
  Channel7: 0,
  Channel8: 0,
  Channel9: 0,
  InverterStatus: '正常', // 假设默认值为 '正常'
});

// 获取数据的函数
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/chart-data');
    console.log('API response:', response.data); // 调试信息
    const chartData = response.data.rtuData;

    // 更新响应式数据
    data.value = {
      Channel1: chartData.series.find((s: Series) => s.name === 'Channel1')?.data[0] || 0,
      Channel2: chartData.series.find((s: Series) => s.name === 'Channel2')?.data[0] || 0,
      Channel3: chartData.series.find((s: Series) => s.name === 'Channel3')?.data[0] || 0,
      Channel5: chartData.series.find((s: Series) => s.name === 'Channel5')?.data[0] || 0,
      Channel7: chartData.series.find((s: Series) => s.name === 'Channel7')?.data[0] || 0,
      Channel8: chartData.series.find((s: Series) => s.name === 'Channel8')?.data[0] || 0,
      Channel9: chartData.series.find((s: Series) => s.name === 'Channel9')?.data[0] || 0,
      InverterStatus: '正常' // 根据实际情况更新
    };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 组件挂载后获取数据
onMounted(() => {
  fetchData();
  // 每秒获取一次数据
  const intervalId = setInterval(fetchData, 1000);
  
  // 确保组件卸载时清除定时器
  onBeforeUnmount(() => clearInterval(intervalId));
});
</script>

<style lang="scss" scoped>
.widget-rain {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  .rain-item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 8px;
    font-size: 14px;
    color: #fff;
    list-style: none;
    background: $dashborad-panel-item-bg;

    .label {
      flex: 1;
    }

    .value {
      font-size: 16px;
      font-weight: bold;
    }

    .unit {
      margin-left: 4px;
    }

    .icon {
      position: absolute;
      top: 4px;
      left: 10px;
      width: 40px;
      height: 40px;
    }

    &.warning {
      color: #fac73e;
    }

    &.normal {
      .value {
        color: #fff;
      }

      .unit {
        color: #aebfe9;
      }
    }
  }
}
</style>
