import * as THREE from 'three'
import { useThree } from '@/hooks' // 引入自定义的useThree钩子
import { onMounted, onUnmounted, ref, shallowRef } from 'vue' // 引入Vue的生命周期钩子和响应式数据相关工具函数
import { size } from 'lodash' // 引入lodash的遍历和大小判断函数
import { v4 as uuid } from 'uuid' // 引入uuid生成唯一标识符的函数
// import { animation } from '@/utils/common'; // 引入自定义的动画函数
// import { MODEL_SKELETON_ENUM } from '@/constants/ModelSkeleton'; // 引入骨架模型的常量枚举

// 风机模型的比例尺
const MODEL_SCALES = <const>[0.5, 0.5, 0.5]

// 获取模型URL，如果环境变量不存在则使用本地路径
const getModelUrl = (modelName: string): string => {
  const apiDomain = import.meta.env.VITE_API_DOMAIN
  if (apiDomain) {
    return `${apiDomain}/models/${modelName}`
  }
  // 使用本地public目录下的模型文件
  return `/models/${modelName}`
}

// 风机模型的URL路径
const MODEL_URL = <const>{
  SKELETON: getModelUrl('turbine.glb'),
  PLANE: getModelUrl('p01.glb'),
  EQUIPMENT: getModelUrl('mox1.glb'),
}

// 自定义风机模型钩子
export function useTurbine() {
  const loading = ref(false) // 加载状态的响应式变量
  const turbine = new THREE.Group() // 创建一个Three.js的Group对象作为风机的容器
  const modelPlane = shallowRef<THREE.Object3D>() // 风机平台模型的响应式引用
  const modelEquipment = shallowRef<THREE.Object3D>() // 风机设备模型的响应式引用

  // 使用useThree钩子提供的相关属性和方法
  const {
    container,
    scene,
    camera,
    control,
    renderMixins,
    loadGLTF,
    loadModels,
    render,
  } = useThree()
  // 加载灯光函数
  const loadLights = () => {
    // 4个灯光位置
    const LIGHT_LIST = [
      [10, 10, 10],
      [-25, 25, 25],
      [25, -25, 25],
      [25, 25, -25],
    ]

    LIGHT_LIST.forEach(([x, y, z]) => {
      const ambientLight = new THREE.DirectionalLight(0xffffff, 0.5) // 降低灯光强度
      ambientLight.position.set(x, y, z)
      scene.value?.add(ambientLight)
    })
  }

  // 加载风机骨架模型
  const loadTurbineSkeleton = async () => {
    // 示例：可以在此处加载风机骨架模型的具体逻辑
  }

  // 加载风机平台模型
  const loadTurbinePlane = async () => {
    const { scene: object } = await loadGLTF(MODEL_URL.PLANE)
    object.scale.set(...MODEL_SCALES)
    object.position.set(0, 0, 0) // 调整模型的初始位置
    object.name = 'plane'
    modelPlane.value = object
    turbine.add(object)
  }

  // 加载风机设备模型
  const loadTurbineEquipments = async () => {
    const { scene: object } = await loadGLTF(MODEL_URL.EQUIPMENT)
    object.scale.set(...MODEL_SCALES)
    object.position.set(0, 1.3, 0) // 调整模型的初始位置
    object.name = 'equipment'
    modelEquipment.value = object
    turbine.add(object)
  }

  // 风机骨架消隐动画
  const skeletonAnimation = () => {
    // 示例：可以在此处添加风机骨架消隐动画的逻辑
  }

  // 风机平台动画
  const planeAnimation = () => {
    const texture = (modelPlane.value?.children[0] as THREE.Mesh)?.material.map
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
    }
    const uid = uuid()
    renderMixins.set(uid, () => {
      const count = texture.repeat.y
      if (count <= 10) {
        texture.repeat.x += 0.01
        texture.repeat.y += 0.02
      } else {
        texture.repeat.x = 0
        texture.repeat.y = 0
      }
    })

    // 找到并旋转阻力齿轮和其他相关部件
    const resistanceGear = modelEquipment.value?.getObjectByName(
      '阻力齿轮'
    ) as THREE.Mesh
    const connectingPart3 = modelEquipment.value?.getObjectByName(
      '连接件3'
    ) as THREE.Mesh
    const bigGear1 = modelEquipment.value?.getObjectByName(
      '大齿轮1'
    ) as THREE.Mesh
    const bigGear2 = modelEquipment.value?.getObjectByName(
      '大齿轮2'
    ) as THREE.Mesh
    const smallGear = modelEquipment.value?.getObjectByName(
      '小齿轮'
    ) as THREE.Mesh
    const connectingPart2 = modelEquipment.value?.getObjectByName(
      '连接件2'
    ) as THREE.Mesh
    const fan = modelEquipment.value?.getObjectByName('风扇') as THREE.Mesh
    const connectingPart1 = modelEquipment.value?.getObjectByName(
      '连接件1'
    ) as THREE.Mesh

    const rotationSpeed = 0.04

    if (
      resistanceGear &&
      connectingPart3 &&
      bigGear1 &&
      bigGear2 &&
      smallGear &&
      fan &&
      connectingPart1
    ) {
      renderMixins.set(uuid(), () => {
        // 同步旋转
        resistanceGear.rotation.x += rotationSpeed
        connectingPart3.rotation.x += rotationSpeed
        bigGear1.rotation.x += rotationSpeed
        bigGear2.rotation.x += rotationSpeed

        // 小齿轮反方向旋转，速度是阻力齿轮的三倍
        smallGear.rotation.x -= rotationSpeed * 3
        connectingPart2.rotation.x -= rotationSpeed * 3
        // 风扇和连接件1旋转方向和小齿轮相同
        fan.rotation.x -= rotationSpeed * 3
        connectingPart1.rotation.x -= rotationSpeed * 3
      })
    }
  }

  // 设备分解动画
  const equipmentDecomposeAnimation = async () => {
    const partsToKeep = [
      '阻力齿轮',
      '连接件3',
      '大齿轮1',
      '大齿轮2',
      '连接件2',
      '小齿轮',
      'ABB电机',
      '风扇',
    ]
    const partsToRemove: THREE.Mesh[] = []

    modelEquipment.value?.traverse((child) => {
      if (child instanceof THREE.Mesh && !partsToKeep.includes(child.name)) {
        partsToRemove.push(child)
      }
    })
    console.log('ss', partsToRemove)
    console.log('ss1', partsToKeep)
    const duration = 2 // 动画持续时间（秒）
    const step = 0.01 // 每次移动的距离

    let elapsed = 0

    const animate = () => {
      if (elapsed < duration) {
        partsToRemove.forEach((part) => {
          const direction = new THREE.Vector3(1, 0, 0) // 向右移动
          part.position.add(direction.multiplyScalar(step))

          // 检查材质是否支持透明度
          if (
            part.material &&
            (part.material instanceof THREE.MeshBasicMaterial ||
              part.material instanceof THREE.MeshStandardMaterial)
          ) {
            part.material.transparent = true // 开启透明
            part.material.opacity -= step // 逐渐变透明
            if (part.material.opacity < 0) part.material.opacity = 0
          }
        })
        elapsed += step
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // 设备合成动画
  const equipmentComposeAnimation = async () => {
    // 示例：可以在此处添加设备合成动画的逻辑
    const partsToKeep = [
      '阻力齿轮',
      '连接件3',
      '大齿轮1',
      '大齿轮2',
      '连接件2',
      'ABB电机',
    ]
    const partsToRemove: THREE.Mesh[] = []

    modelEquipment.value?.traverse((child) => {
      if (child instanceof THREE.Mesh && !partsToKeep.includes(child.name)) {
        partsToRemove.push(child)
      }
    })
    console.log('ss', partsToRemove)
    console.log('ss1', partsToKeep)
    const duration = 2 // 动画持续时间（秒）
    const step = 0.01 // 每次移动的距离

    let elapsed = 0

    const animate = () => {
      if (elapsed < duration) {
        partsToRemove.forEach((part) => {
          const direction = new THREE.Vector3(-1, 0, 0) // 向右移动
          part.position.add(direction.multiplyScalar(step))

          // 检查材质是否支持透明度
          if (
            part.material &&
            (part.material instanceof THREE.MeshBasicMaterial ||
              part.material instanceof THREE.MeshStandardMaterial)
          ) {
            part.material.transparent = true // 开启透明
            part.material.opacity += step // 逐渐变透明
            if (part.material.opacity < 0) part.material.opacity = 0
          }
        })
        elapsed += step
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // 风机设备点击事件处理函数
  const onEquipmentClick = () => {
    const equipmentList: any = []
    modelEquipment.value?.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return undefined
      const { material } = mesh
      mesh.material = material.clone()
      equipmentList.push(mesh)
      return undefined
    })
    const handler = (event: MouseEvent) => {
      const el = container.value as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.value!)
      const intersects = raycaster.intersectObject(modelEquipment.value!, true)
      if (size(intersects) <= 0) return undefined
      const equipment = <any>intersects[0].object
      if (!equipment) return undefined
      equipmentList.forEach((child: any) => {
        child.material.emissive.setHex(child.currentHex)
      })
      equipment.currentHex =
        equipment.currentHex ?? equipment.material.emissive.getHex()
      equipment.material.emissive.setHex(0xff0000)
      return undefined
    }
    document.addEventListener('click', handler)
    onUnmounted(() => document.removeEventListener('click', handler))
  }

  // 在组件挂载后执行的初始化操作
  onMounted(async () => {
    loading.value = true

    // 将风机模型添加到场景中
    scene.value?.add(turbine)

    // 设置相机位置，确保模型在视野内并居中显示
    camera.value?.position.set(-8, 5, 13) // 调整相机位置
    control.value?.target.set(0, 2, 0) // 设置控制器的目标点
    control.value?.update() // 更新控制器状态

    // 加载灯光
    loadLights()

    // 加载所有的模型
    await loadModels([
      loadTurbineSkeleton(),
      loadTurbinePlane(),
      loadTurbineEquipments(),
    ])

    loading.value = false // 加载完成，loading状态设为false

    render() // 执行渲染函数

    // 绑定设备点击事件处理函数
    onEquipmentClick()

    // 执行骨架消隐动画
    skeletonAnimation()

    // 执行平台动画
    planeAnimation()
  })

  // 返回给组件使用的对象
  return {
    container, // 容器的引用
    loading, // 加载状态的引用
    turbine, // 风机模型的引用
    equipmentDecomposeAnimation, // 设备分解动画函数的引用
    equipmentComposeAnimation, // 设备合成动画函数的引用
  }
}

export default useTurbine
