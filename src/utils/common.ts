import { createVNode, defineComponent, h, render } from 'vue'
import TWEEN from '@tweenjs/tween.js'
import { isFunction } from 'lodash'

// 实例化一个Vue组件并返回其虚拟节点
export const instantiatedComponent = (component: any, props: any) => {
  // 定义一个Vue组件
  const newComponent = defineComponent({
    render() {
      // 渲染传入的组件，并传递props
      return h(component, props)
    },
  })
  // 创建该组件的虚拟节点
  const instance = createVNode(newComponent)
  // 在一个新创建的<div>元素上进行渲染
  render(instance, document.createElement('div'))
  // 返回创建的虚拟节点实例
  return instance
}

// 执行动画效果
export const animation = (props: {
  from: Record<string, any> // 起始状态，一个包含任意类型属性的对象
  to: Record<string, any> // 结束状态，一个包含任意类型属性的对象
  duration: number // 动画持续时间（毫秒）
  easing?: any // 缓动函数，使用TWEEN.Easing中的函数，默认为TWEEN.Easing.Quadratic.Out
  onUpdate: (params: Record<string, any>) => void // 更新回调函数，每次动画状态更新时调用
  onComplete?: (params: Record<string, any>) => void // 完成回调函数，动画结束时调用
}) => {
  const {
    from,
    to,
    duration,
    easing = TWEEN.Easing.Quadratic.Out, // 默认缓动函数为二次方缓出
    onUpdate,
    onComplete,
  } = props

  // 创建一个TWEEN.Tween对象，设置起始状态和结束状态，以及动画持续时间和缓动函数
  return new TWEEN.Tween(from)
    .to(to, duration)
    .easing(easing)
    .onUpdate((object) => isFunction(onUpdate) && onUpdate(object)) // 设置更新回调函数
    .onComplete((object) => isFunction(onComplete) && onComplete(object)) // 设置完成回调函数
    .start() // 启动动画
}
