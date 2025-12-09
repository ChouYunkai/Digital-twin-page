// 轴瓦检测指标数据结构
export interface BearingBushInspectionData {
  // 1. 尺寸与形位精度
  dimensionalTolerances: {
    wallThickness: {
      value: string
      tolerance: string
      standard: string
      status: '合格' | '不合格'
    }
    outerDiameter: {
      value: string
      tolerance: string
      standard: string
      status: '合格' | '不合格'
    }
    roundness: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
    concentricity: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
    width: {
      value: string
      tolerance: string
      standard: string
      status: '合格' | '不合格'
    }
    lockGrooveSize: {
      value: string
      tolerance: string
      standard: string
      status: '合格' | '不合格'
    }
  }
  // 2. 表面质量与粗糙度
  surfaceQuality: {
    roughness: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
    defects: {
      scratches: boolean
      cracks: boolean
      pores: boolean
      delamination: boolean
      deformation: boolean
      impurities: boolean
      status: '合格' | '不合格'
    }
    inspectionMethod: string
  }
  // 3. 材料成分与层间结合
  materialComposition: {
    chemicalComposition: {
      tin: { value: string; standard: string; status: '合格' | '不合格' }
      lead: { value: string; standard: string; status: '合格' | '不合格' }
      copper: { value: string; standard: string; status: '合格' | '不合格' }
      aluminum: { value: string; standard: string; status: '合格' | '不合格' }
      standard: string
    }
    layerThickness: {
      copperLayer: string
      alloyLayer: string
      standard: string
      status: '合格' | '不合格'
    }
    bondingStrength: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
  }
  // 4. 硬度
  hardness: {
    steelBack: {
      value: string
      range: string
      standard: string
      status: '合格' | '不合格'
    }
    copperBase: {
      value: string
      range: string
      standard: string
      status: '合格' | '不合格'
    }
    alloyLayer: {
      value: string
      range: string
      standard: string
      status: '合格' | '不合格'
    }
  }
  // 5. 力学性能
  mechanicalProperties: {
    fatigueStrength: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
    compressiveStrength: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
  }
  // 6. 摩擦学性能
  tribologicalPerformance: {
    frictionCoefficient: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
    pvLimit: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
    wearRate: {
      value: string
      requirement: string
      standard: string
      status: '合格' | '不合格'
    }
  }
  // 7. 配合与装配要求
  fitAndAssembly: {
    radialClearance: {
      mainBearing: {
        value: string
        range: string
        standard: string
        status: '合格' | '不合格'
      }
      connectingRod: {
        value: string
        range: string
        standard: string
        status: '合格' | '不合格'
      }
    }
    assemblyReliability: {
      wedgeForce: string
      positioning: string
      looseness: boolean
      tilt: boolean
      offset: boolean
      status: '合格' | '不合格'
    }
  }
}

// 轴瓦检测指标静态数据（符合GB/T标准）
export const bearingBushInspectionData: BearingBushInspectionData = {
  dimensionalTolerances: {
    wallThickness: {
      value: '0.35',
      tolerance: '±0.004',
      standard: 'GB/T 2768, ISO标准',
      status: '合格',
    },
    outerDiameter: {
      value: '50.025',
      tolerance: '±0.010',
      standard: 'GB/T 2768',
      status: '合格',
    },
    roundness: {
      value: '4.5',
      requirement: '≤ 5',
      standard: 'GB/T 307.1-2005',
      status: '合格',
    },
    concentricity: {
      value: '6.2',
      requirement: '≤ 8',
      standard: 'GB/T 307.1-2005',
      status: '合格',
    },
    width: {
      value: '25.015',
      tolerance: '±0.020',
      standard: 'GB/T 2768',
      status: '合格',
    },
    lockGrooveSize: {
      value: '2.5',
      tolerance: '±0.05',
      standard: 'GB/T 2768',
      status: '合格',
    },
  },
  surfaceQuality: {
    roughness: {
      value: '0.4',
      requirement: '≤ 0.4',
      standard: 'GB/T 3505',
      status: '合格',
    },
    defects: {
      scratches: false,
      cracks: false,
      pores: false,
      delamination: false,
      deformation: false,
      impurities: false,
      status: '合格',
    },
    inspectionMethod: '目视检查、放大镜(50倍)、磁粉检测',
  },
  materialComposition: {
    chemicalComposition: {
      tin: { value: '8.5', standard: 'GB/T 15115', status: '合格' },
      lead: { value: '12.3', standard: 'GB/T 15115', status: '合格' },
      copper: { value: '75.2', standard: 'GB/T 1176', status: '合格' },
      aluminum: { value: '4.0', standard: 'GB/T 1176', status: '合格' },
      standard: 'GB/T 1176, GB/T 15115',
    },
    layerThickness: {
      copperLayer: '0.35',
      alloyLayer: '25',
      standard: 'GB/T 15115',
      status: '合格',
    },
    bondingStrength: {
      value: '52.5',
      requirement: '≥ 45',
      standard: 'GB/T 15115',
      status: '合格',
    },
  },
  hardness: {
    steelBack: {
      value: '220',
      range: '180-260',
      standard: 'GB/T 4340',
      status: '合格',
    },
    copperBase: {
      value: '82',
      range: '60-100',
      standard: 'GB/T 4340',
      status: '合格',
    },
    alloyLayer: {
      value: '28',
      range: '15-40',
      standard: 'GB/T 4340',
      status: '合格',
    },
  },
  mechanicalProperties: {
    fatigueStrength: {
      value: '85',
      requirement: '≥ 70',
      standard: 'GB/T 307.1-2005',
      status: '合格',
    },
    compressiveStrength: {
      value: '320',
      requirement: '≥ 280',
      standard: 'GB/T 307.1-2005',
      status: '合格',
    },
  },
  tribologicalPerformance: {
    frictionCoefficient: {
      value: '0.08',
      requirement: '≤ 0.12',
      standard: 'ASTM D4172',
      status: '合格',
    },
    pvLimit: {
      value: '15.5',
      requirement: '≥ 12',
      standard: 'ASTM D4172',
      status: '合格',
    },
    wearRate: {
      value: '2.3×10⁻⁶',
      requirement: '≤ 5×10⁻⁶',
      standard: 'ASTM G99',
      status: '合格',
    },
  },
  fitAndAssembly: {
    radialClearance: {
      mainBearing: {
        value: '0.035',
        range: '0.020-0.050',
        standard: 'GB/T 2768',
        status: '合格',
      },
      connectingRod: {
        value: '0.042',
        range: '0.025-0.060',
        standard: 'GB/T 2768',
        status: '合格',
      },
    },
    assemblyReliability: {
      wedgeForce: '符合要求',
      positioning: '可靠',
      looseness: false,
      tilt: false,
      offset: false,
      status: '合格',
    },
  },
}
