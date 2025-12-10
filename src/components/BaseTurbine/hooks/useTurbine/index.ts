import * as THREE from 'three'
import { useThree } from '@/hooks' // 引入自定义的useThree钩子
import { onMounted, onUnmounted, ref, shallowRef } from 'vue' // 引入Vue的生命周期钩子和响应式数据相关工具函数
import { size } from 'lodash' // 引入lodash的遍历和大小判断函数
import { v4 as uuid } from 'uuid' // 引入uuid生成唯一标识符的函数

// 风机模型的比例尺
const MODEL_SCALES = <const>[0.5, 0.5, 0.5]

// 风机模型的URL路径
const MODEL_URL = <const>{
  SKELETON: `${import.meta.env.VITE_API_DOMAIN}/models/turbine.glb`,
  PLANE: `${import.meta.env.VITE_API_DOMAIN}/models/p01.glb`,
  EQUIPMENT: `${import.meta.env.VITE_API_DOMAIN}/models/mox1.glb`,
}

// 自定义风机模型钩子
export function useTurbine() {
  const loading = ref(false) // 加载状态的响应式变量
  const turbine = new THREE.Group() // 创建一个Three.js的Group对象作为风机的容器
  const modelPlane = shallowRef<THREE.Object3D>() // 风机平台模型的响应式引用
  const modelEquipment = shallowRef<THREE.Object3D>() // 风机设备模型的响应式引用
  const modelBearingBush = shallowRef<THREE.Object3D>() // 轴瓦模型的响应式引用
  const currentModelType = ref<'equipment' | 'bearingBush'>('equipment') // 当前模型类型
  const animationIds = ref<Set<string>>(new Set()) // 存储动画ID，用于清理

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

  // --------------------------------------------------------------------------------
  // 1. 灯光系统
  // --------------------------------------------------------------------------------
  const loadLights = () => {
    // 基础环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.value?.add(ambientLight)

    // 主平行光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0)
    mainLight.position.set(10, 20, 10)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.value?.add(mainLight)

    // 侧面补光
    const sideLight = new THREE.DirectionalLight(0xddeeff, 0.5)
    sideLight.position.set(-10, 0, 5)
    scene.value?.add(sideLight)
  }
  // --------------------------------------------------------------------------------
  // 2. 相机聚焦辅助：使传入模型居中显示 **（已实现所需功能）**
  // --------------------------------------------------------------------------------
  const focusOnObject = (object?: THREE.Object3D, padding = 1.6) => {
    if (!object || !camera.value || !control.value) return

    // 确保对象的世界矩阵已更新
    object.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(object)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // 检查边界框是否有效
    if (size.x === 0 && size.y === 0 && size.z === 0) {
      // 如果边界框无效，使用默认位置
      return
    }

    const maxDim = Math.max(size.x, size.y, size.z)
    const distance = (maxDim || 1) * padding
    // 采用对角方向拉开距离，避免与模型重合
    const offset = new THREE.Vector3(1, 1, 1)
      .normalize()
      .multiplyScalar(distance)
    const newPosition = center.clone().add(offset)

    camera.value.position.copy(newPosition)
    camera.value.lookAt(center)
    control.value.target.copy(center)
    control.value.update()
  }
  // ... (中间的加载函数: loadTurbineSkeleton, loadTurbinePlane, unloadTurbineEquipments, loadTurbineEquipments 保持不变)
  const loadTurbineSkeleton = async () => {
    /* ... */
  }
  const loadTurbinePlane = async () => {
    const { scene: object } = await loadGLTF(MODEL_URL.PLANE)
    object.scale.set(...MODEL_SCALES)
    object.position.set(0, 0, 0)
    object.name = 'plane'
    modelPlane.value = object
    turbine.add(object)
  }
  const unloadTurbineEquipments = () => {
    if (modelEquipment.value) {
      turbine.remove(modelEquipment.value)
      modelEquipment.value.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material))
            child.material.forEach((mat: THREE.Material) => mat.dispose())
          else child.material.dispose()
        }
      })
      modelEquipment.value = undefined
    }
  }
  const loadTurbineEquipments = async () => {
    const { scene: object } = await loadGLTF(MODEL_URL.EQUIPMENT)
    object.scale.set(...MODEL_SCALES)
    object.position.set(0, 11.7, 0)
    object.name = 'equipment'
    modelEquipment.value = object
    turbine.add(object)
  }

  // ==================================================================================
  // 基础轴瓦模型 (Basic Bearing Bush) - 无油孔/无油槽版
  // ==================================================================================
  const createBearingBushGeometry = () => {
    const group = new THREE.Group()
    group.name = 'BasicBearingBush'

    // --- 1. 参数定义 (Z轴为轴向) ---
    const innerRadius = 1.0 // 轴孔半径
    const linerThickness = 0.05 // 巴氏合金层厚度
    const shellThickness = 0.4 // 钢背厚度
    const length = 3.0 // 轴瓦长度
    const flangeWidth = 0.4 // 两端凸缘宽度
    const flangeHeight = 0.2 // 凸缘高出外壳的高度
    const segments = 128 // 高分辨率

    // --- 2. 材质定义 ---
    // [外壳] 钢背 (Steel Backing) - 深灰色，坚硬
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x5a6e7c, // 蓝灰色钢
      metalness: 0.7,
      roughness: 0.5,
    })

    // [内衬] 巴氏合金 (Babbitt) - 浅灰色/银白色，非常光滑，低摩擦
    const linerMat = new THREE.MeshStandardMaterial({
      color: 0xe8e8e8, // 亮银色
      metalness: 0.4,
      roughness: 0.15, // 光滑
    })

    // --- 3. 几何体构建函数 ---
    const createHalfShell = (isUpper: boolean) => {
      const halfGroup = new THREE.Group()
      halfGroup.name = isUpper ? 'UpperHalf' : 'LowerHalf'

      // 使用 ExtrudeGeometry 创建实体半圆管 (包含厚度)
      const createExtrudedHalf = (
        rIn: number,
        rOut: number,
        len: number,
        mat: THREE.Material,
        name: string
      ) => {
        const shape = new THREE.Shape()
        // 绘制半圆环截面
        // 注意：isUpper决定是上半圆(0到PI)还是下半圆(PI到2PI)
        shape.absarc(
          0,
          0,
          rOut,
          isUpper ? 0 : Math.PI,
          isUpper ? Math.PI : Math.PI * 2,
          false
        )
        shape.lineTo(rIn * (isUpper ? -1 : 1), 0) // 封闭边缘
        shape.absarc(
          0,
          0,
          rIn,
          isUpper ? Math.PI : Math.PI * 2,
          isUpper ? 0 : Math.PI,
          true
        ) // 内圆 (孔)
        shape.lineTo(rOut * (isUpper ? 1 : -1), 0) // 封闭

        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: len,
          bevelEnabled: false,
          curveSegments: segments,
          steps: 1,
        })

        // 修正：不要使用 center()，因为它会将 Y 轴归零导致上下重叠。
        // 我们只需要在 Z 轴方向居中。
        geo.translate(0, 0, -len / 2)

        const mesh = new THREE.Mesh(geo, mat)
        mesh.name = name
        mesh.castShadow = true
        mesh.receiveShadow = true
        return mesh
      }

      // 1. 内衬层实体
      const linerMesh = createExtrudedHalf(
        innerRadius,
        innerRadius + linerThickness,
        length,
        linerMat,
        'Liner'
      )
      halfGroup.add(linerMesh)

      // 2. 外壳主体实体
      const mainShellRadius = innerRadius + linerThickness + shellThickness
      const shellMesh = createExtrudedHalf(
        innerRadius + linerThickness,
        mainShellRadius,
        length - flangeWidth * 2,
        shellMat,
        'ShellBody'
      )
      halfGroup.add(shellMesh)

      // 3. 两端凸缘 (Flanges)
      const flangeRadius = mainShellRadius + flangeHeight
      const flangeZOffset = (length - flangeWidth) / 2

      const frontFlange = createExtrudedHalf(
        innerRadius + linerThickness,
        flangeRadius,
        flangeWidth,
        shellMat,
        'FrontFlange'
      )
      frontFlange.position.z = flangeZOffset
      halfGroup.add(frontFlange)

      const backFlange = createExtrudedHalf(
        innerRadius + linerThickness,
        flangeRadius,
        flangeWidth,
        shellMat,
        'BackFlange'
      )
      backFlange.position.z = -flangeZOffset
      halfGroup.add(backFlange)

      // 4. (已移除) 进油孔
      // 5. (已移除) 润滑油槽

      return halfGroup
    }

    // --- 4. 组装 ---
    const upperHalf = createHalfShell(true)
    const lowerHalf = createHalfShell(false)

    // 由于修正了 createExtrudedHalf 的居中逻辑，现在 0,0,0 即为闭合状态
    upperHalf.position.y = 0
    lowerHalf.position.y = 0

    group.add(upperHalf)
    group.add(lowerHalf)

    return group
  }

  // 卸载轴瓦模型
  const unloadBearingBush = () => {
    if (modelBearingBush.value) {
      turbine.remove(modelBearingBush.value)
      modelBearingBush.value.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material))
            child.material.forEach((mat: THREE.Material) => mat.dispose())
          else child.material.dispose()
        }
      })
      modelBearingBush.value = undefined
    }
  }

  // 加载轴瓦模型
  const loadBearingBush = async () => {
    const bearingBushModel = createBearingBushGeometry()
    bearingBushModel.scale.set(0.8, 0.8, 0.8)
    // 调整位置
    bearingBushModel.position.set(0, 12.0, 0)
    bearingBushModel.name = 'bearingBushAssembly'
    modelBearingBush.value = bearingBushModel
    turbine.add(bearingBushModel)
  }

  // 清理所有动画
  const clearAllAnimations = () => {
    animationIds.value.forEach((id) => {
      renderMixins.delete(id)
    })
    animationIds.value.clear()
  }

  // ==================================================================================
  // 轴瓦动画：围绕X轴旋转（以两片轴瓦的中心位置为旋转中心）
  // ==================================================================================
  const bearingBushAnimation = () => {
    if (!modelBearingBush.value) return

    // 重置位置，确保静止状态是闭合的
    const upperHalf = modelBearingBush.value.getObjectByName('UpperHalf')
    if (upperHalf) {
      upperHalf.position.y = 0
      upperHalf.rotation.set(0, 0, 0)
    }
    modelBearingBush.value.rotation.set(0, 0, 0)

    // 添加旋转动画（围绕X轴缓慢旋转，以两片轴瓦的中心为旋转中心）
    const rotateUid = uuid()
    animationIds.value.add(rotateUid)
    renderMixins.set(rotateUid, () => {
      // 检查模型是否仍然存在且当前类型正确
      if (currentModelType.value !== 'bearingBush' || !modelBearingBush.value) {
        renderMixins.delete(rotateUid)
        animationIds.value.delete(rotateUid)
        return
      }
      // 围绕X轴缓慢旋转（从侧面看是绕水平轴旋转）
      modelBearingBush.value.rotation.y += 0.005
    })
  }

  const skeletonAnimation = () => {
    /* ... */
  }
  const planeAnimation = () => {
    /* ... */
  }

  const onEquipmentClick = () => {
    if (!modelEquipment.value) return
    const equipmentList: any = []
    modelEquipment.value.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return
      const { material } = mesh
      mesh.material = material.clone()
      equipmentList.push(mesh)
    })
    const handler = (event: MouseEvent) => {
      if (currentModelType.value !== 'equipment' || !modelEquipment.value)
        return
      const el = container.value as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.value!)
      const intersects = raycaster.intersectObject(modelEquipment.value, true)
      if (size(intersects) <= 0) return
      const equipment = <any>intersects[0].object
      if (!equipment) return
      equipmentList.forEach((child: any) => {
        child.material.emissive.setHex(child.currentHex)
      })
      equipment.currentHex =
        equipment.currentHex ?? equipment.material.emissive.getHex()
      equipment.material.emissive.setHex(0xff0000)
    }
    document.addEventListener('click', handler)
    onUnmounted(() => document.removeEventListener('click', handler))
  }

  const switchToBearingBush = async () => {
    if (currentModelType.value === 'bearingBush') return
    loading.value = true
    clearAllAnimations()
    unloadTurbineEquipments()
    await loadBearingBush()
    currentModelType.value = 'bearingBush'
    bearingBushAnimation()

    // 调整相机聚焦
    control.value?.target.set(0, 12, 0)
    camera.value?.position.set(4, 14, 6)
    control.value?.update()

    loading.value = false
  }

  const switchToEquipment = async () => {
    if (currentModelType.value === 'equipment') return
    loading.value = true
    clearAllAnimations()
    unloadBearingBush()
    await loadTurbineEquipments()
    currentModelType.value = 'equipment'
    onEquipmentClick()
    planeAnimation()

    // 恢复相机
    control.value?.target.set(0, 12, 0)
    camera.value?.position.set(-8, 15, 13)
    control.value?.update()

    loading.value = false
  }

  const equipmentDecomposeAnimation = async () => {
    /* ... (保持不变) */
  }
  const equipmentComposeAnimation = async () => {
    /* ... (保持不变) */
  }

  onMounted(async () => {
    loading.value = true
    scene.value?.add(turbine)
    camera.value?.position.set(-8, 15, 13)
    control.value?.target.set(0, 12, 0)
    control.value?.update()

    loadLights()

    await loadModels([
      loadTurbineSkeleton(),
      loadTurbinePlane(),
      loadTurbineEquipments(),
    ])

    loading.value = false
    render()
    onEquipmentClick()
    skeletonAnimation()
    planeAnimation()
  })

  onUnmounted(() => {
    clearAllAnimations()
    unloadTurbineEquipments()
    unloadBearingBush()
  })

  return {
    container,
    loading,
    turbine,
    equipmentDecomposeAnimation,
    equipmentComposeAnimation,
    switchToBearingBush,
    switchToEquipment,
    currentModelType,
    unloadTurbineEquipments,
    unloadBearingBush,
  }
}

export default useTurbine
