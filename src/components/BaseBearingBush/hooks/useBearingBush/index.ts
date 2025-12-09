import * as THREE from 'three'
import { useThree } from '@/hooks'
import { onMounted, ref, shallowRef } from 'vue'
import { v4 as uuid } from 'uuid'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'

// 轴瓦模型的比例尺
const MODEL_SCALES = <const>[1, 1, 1]

// 自定义轴瓦模型钩子
export function useBearingBush() {
  const loading = ref(false)
  const bearingBush = new THREE.Group()
  const modelBearingBush = shallowRef<THREE.Object3D>()

  const { container, scene, camera, control, renderMixins, render } = useThree()

  // 加载灯光函数
  const loadLights = () => {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.value?.add(ambientLight)

    // 主光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
    mainLight.position.set(10, 10, 10)
    mainLight.castShadow = true
    scene.value?.add(mainLight)

    // 辅助光源
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
    fillLight.position.set(-10, 5, -10)
    scene.value?.add(fillLight)

    // 点光源增强细节
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(0, 5, 5)
    scene.value?.add(pointLight)
  }

  // 创建轴瓦几何体
  const createBearingBushGeometry = () => {
    const group = new THREE.Group()

    // 轴瓦主要参数
    const innerRadius = 2 // 内半径
    const outerRadius = 2.5 // 外半径
    const height = 4 // 高度
    const segments = 64 // 分段数，用于平滑度

    // 创建现代金属材质
    const bushMaterial = new THREE.MeshStandardMaterial({
      color: 0x718096, // 现代灰色
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1.2,
    })

    const outerMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5568,
      metalness: 0.85,
      roughness: 0.2,
    })

    // 创建上半部分轴瓦内表面（半圆柱）
    const upperInnerGeometry = new THREE.CylinderGeometry(
      innerRadius,
      innerRadius,
      height,
      segments,
      1,
      false,
      0,
      Math.PI
    )
    const upperBush = new THREE.Mesh(upperInnerGeometry, bushMaterial)
    upperBush.rotation.z = Math.PI / 2
    upperBush.position.y = 0
    upperBush.name = 'upperBush'
    group.add(upperBush)

    // 创建下半部分轴瓦内表面（半圆柱）
    const lowerInnerGeometry = new THREE.CylinderGeometry(
      innerRadius,
      innerRadius,
      height,
      segments,
      1,
      false,
      Math.PI,
      Math.PI
    )
    const lowerBush = new THREE.Mesh(lowerInnerGeometry, bushMaterial)
    lowerBush.rotation.z = Math.PI / 2
    lowerBush.position.y = 0
    lowerBush.name = 'lowerBush'
    group.add(lowerBush)

    // 创建外壁（使用ExtrudeGeometry创建环形外壁）
    const wallShape = new THREE.Shape()
    wallShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)
    const holePath = new THREE.Path()
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
    wallShape.holes.push(holePath)

    const extrudeSettings = {
      depth: height,
      bevelEnabled: false,
      curveSegments: segments,
    }
    const wallExtrudeGeometry = new THREE.ExtrudeGeometry(
      wallShape,
      extrudeSettings
    )
    const wallExtrude = new THREE.Mesh(wallExtrudeGeometry, outerMaterial)
    wallExtrude.position.y = 0
    wallExtrude.name = 'outerWall'
    group.add(wallExtrude)

    // 创建顶部和底部圆环
    const wallRingTop = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, segments),
      outerMaterial
    )
    wallRingTop.rotation.x = -Math.PI / 2
    wallRingTop.position.y = height / 2
    group.add(wallRingTop)

    const wallRingBottom = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, segments),
      outerMaterial
    )
    wallRingBottom.rotation.x = -Math.PI / 2
    wallRingBottom.position.y = -height / 2
    group.add(wallRingBottom)

    // 添加细节：螺栓孔（在顶部和底部）
    const boltHoleRadius = 0.2
    const boltHoleDepth = 0.4
    const boltDistance = outerRadius + 0.3
    const boltPositions = [
      { x: 0, z: boltDistance },
      {
        x: boltDistance * Math.cos(Math.PI / 3),
        z: boltDistance * Math.sin(Math.PI / 3),
      },
      {
        x: boltDistance * Math.cos(-Math.PI / 3),
        z: boltDistance * Math.sin(-Math.PI / 3),
      },
      { x: -boltDistance, z: 0 },
      {
        x: boltDistance * Math.cos((2 * Math.PI) / 3),
        z: boltDistance * Math.sin((2 * Math.PI) / 3),
      },
      {
        x: boltDistance * Math.cos((-2 * Math.PI) / 3),
        z: boltDistance * Math.sin((-2 * Math.PI) / 3),
      },
    ]

    const boltHoleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      metalness: 0.6,
      roughness: 0.4,
    })

    boltPositions.forEach((pos) => {
      const boltHoleGeometry = new THREE.CylinderGeometry(
        boltHoleRadius,
        boltHoleRadius,
        boltHoleDepth,
        16
      )
      const boltHole = new THREE.Mesh(boltHoleGeometry, boltHoleMaterial)
      boltHole.position.set(pos.x, height / 2 + boltHoleDepth / 2, pos.z)
      boltHole.rotation.x = Math.PI / 2
      boltHole.name = 'boltHole'
      group.add(boltHole)

      // 底部也添加
      const boltHoleBottom = boltHole.clone()
      boltHoleBottom.position.y = -height / 2 - boltHoleDepth / 2
      group.add(boltHoleBottom)
    })

    // 添加内表面细节（润滑槽）
    const grooveRadius = innerRadius - 0.15
    const grooveThickness = 0.08
    const grooveGeometry = new THREE.TorusGeometry(
      grooveRadius,
      grooveThickness,
      16,
      64,
      Math.PI
    )
    const grooveMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      metalness: 0.7,
      roughness: 0.3,
    })

    // 在上下两部分各添加润滑槽
    const grooveCount = 3
    for (let i = 0; i < grooveCount; i += 1) {
      const yPos = (height / (grooveCount + 1)) * (i + 1) - height / 2
      const upperGroove = new THREE.Mesh(grooveGeometry, grooveMaterial)
      upperGroove.position.y = yPos
      upperGroove.rotation.x = Math.PI / 2
      upperGroove.rotation.z = Math.PI / 2
      group.add(upperGroove)
    }

    // 添加分割线（上下两部分的分界线）
    const splitLineGeometry = new THREE.CylinderGeometry(
      innerRadius,
      innerRadius,
      0.05,
      segments
    )
    const splitLineMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      metalness: 0.5,
      roughness: 0.5,
    })
    const splitLine = new THREE.Mesh(splitLineGeometry, splitLineMaterial)
    splitLine.rotation.z = Math.PI / 2
    splitLine.position.y = 0
    group.add(splitLine)

    return group
  }

  // 加载轴瓦模型
  const loadBearingBush = async () => {
    const bearingBushModel = createBearingBushGeometry()
    bearingBushModel.scale.set(...MODEL_SCALES)
    bearingBushModel.position.set(0, 0, 0)
    bearingBushModel.name = 'bearingBush'
    modelBearingBush.value = bearingBushModel
    bearingBush.add(bearingBushModel)
  }

  // 轴瓦旋转动画
  const bearingBushAnimation = () => {
    if (!modelBearingBush.value) return

    const uid = uuid()
    renderMixins.set(uid, () => {
      // 缓慢旋转展示模型
      modelBearingBush.value!.rotation.y += 0.005
    })
  }

  // 轴瓦点击事件处理函数
  const onBearingBushClick = () => {
    const bushList: any = []
    modelBearingBush.value?.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return undefined
      const { material } = mesh
      if (material instanceof THREE.MeshStandardMaterial) {
        mesh.material = material.clone()
        bushList.push(mesh)
      }
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
      const intersects = raycaster.intersectObject(
        modelBearingBush.value!,
        true
      )
      if (intersects.length <= 0) {
        bushList.forEach((child: any) => {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.setHex(0x000000)
          }
        })
        return undefined
      }
      const bush = <any>intersects[0].object
      if (!bush) return undefined
      bushList.forEach((child: any) => {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissive.setHex(0x000000)
        }
      })
      if (bush.material instanceof THREE.MeshStandardMaterial) {
        bush.material.emissive.setHex(0x00ff00)
      }
      return undefined
    }
    document.addEventListener('click', handler)
  }

  // 在组件挂载后执行的初始化操作
  onMounted(async () => {
    loading.value = true

    // 将轴瓦模型添加到场景中
    scene.value?.add(bearingBush)

    // 设置相机位置，确保模型在视野内并居中显示
    camera.value?.position.set(0, 2, 8)
    control.value?.target.set(0, 0, 0)
    control.value?.update()

    // 加载灯光
    loadLights()

    // 加载轴瓦模型
    await loadBearingBush()

    loading.value = false

    render()

    // 绑定轴瓦点击事件处理函数
    onBearingBushClick()

    // 执行旋转动画
    bearingBushAnimation()
  })

  // 返回给组件使用的对象
  return {
    container,
    loading,
    bearingBush,
    inspectionData: bearingBushInspectionData, // 轴瓦检测指标数据
  }
}

export default useBearingBush
