/**
 * 模拟数据服务
 * 用于替代真实的API调用，生成模拟数据
 */

// 生成指定范围内的随机数
const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min

// 生成模拟的RTU数据（用于MonitorStatistics）
export const generateMockRtuData = () => {
  const dataPoints = 100 // 生成100个数据点

  return {
    rtuData: {
      series: [
        {
          name: 'Channel1',
          data: Array.from({ length: dataPoints }, () => random(1000, 5000)), // 输出电流 (100-500)
        },
        {
          name: 'Channel2',
          data: Array.from({ length: dataPoints }, () =>
            Math.floor(random(100, 1000))
          ), // 计数值
        },
        {
          name: 'Channel3',
          data: Array.from({ length: dataPoints }, () => random(45, 55)), // 输出频率 (Hz)
        },
        {
          name: 'Channel5',
          data: Array.from({ length: dataPoints }, () => random(2000, 4000)), // 输出电压值 (200-400V)
        },
        {
          name: 'Channel7',
          data: Array.from({ length: dataPoints }, () => random(1000, 5000)), // 输出功率 (100-500kW)
        },
        {
          name: 'Channel8',
          data: Array.from({ length: dataPoints }, () =>
            Math.floor(random(1000, 2000))
          ), // 马达实际速度 (rPm)
        },
        {
          name: 'Channel9',
          data: Array.from({ length: dataPoints }, () => random(50, 100)), // 输出转矩 (%)
        },
      ],
    },
  }
}

// 生成模拟的ADC数据（用于MonitorEnergy和MonitorActive）
export const generateMockAdcData = () => {
  const dataPoints = 1000 // 生成1000个数据点用于图表

  // 生成带噪声的正弦波数据
  const generateSineWave = (
    frequency: number,
    amplitude: number,
    offset: number = 0
  ) =>
    Array.from({ length: dataPoints }, (_, i) => {
      const time = i / 10 // 时间步长
      const value = Math.sin(time * frequency) * amplitude + offset
      const noise = random(-amplitude * 0.1, amplitude * 0.1) // 添加10%的噪声
      return value + noise
    })

  return {
    adcData: {
      series: [
        {
          name: 'Channel1',
          data: generateSineWave(0.1, 50, 100), // 声音信号
        },
        {
          name: 'Channel2',
          data: generateSineWave(0.2, 30, 50), // 震动信号通道2
        },
        {
          name: 'Channel3',
          data: generateSineWave(0.15, 40, 60), // 震动信号通道3
        },
        {
          name: 'Channel4',
          data: generateSineWave(0.25, 35, 55), // 震动信号通道4
        },
        {
          name: 'Channel5',
          data: generateSineWave(0.18, 45, 65), // 震动信号通道5
        },
      ],
    },
  }
}

// 模拟API响应（包含rtuData和adcData）
export const generateMockChartData = () => ({
  ...generateMockRtuData(),
  ...generateMockAdcData(),
})

// 模拟异步API调用（延迟模拟网络请求）
export const mockApiCall = <T>(data: T, delay: number = 100): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })

// 获取模拟的chart-data API响应
export const getMockChartData = async () =>
  mockApiCall(generateMockChartData(), 50)
