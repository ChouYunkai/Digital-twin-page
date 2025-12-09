<template>
  <WidgetPanel title="轴瓦关键参数">
    <ul class="widget-rain">
      <li class="rain-item normal">
        <span class="label">钢背硬度</span>
        <span class="value">{{ inspectionData.hardness.steelBack.value }}</span>
        <span class="unit">HB</span>
      </li>
      <li class="rain-item normal">
        <span class="label">铜基硬度</span>
        <span class="value">{{
          inspectionData.hardness.copperBase.value
        }}</span>
        <span class="unit">HB</span>
      </li>
      <li class="rain-item normal">
        <span class="label">合金层硬度</span>
        <span class="value">{{
          inspectionData.hardness.alloyLayer.value
        }}</span>
        <span class="unit">HV</span>
      </li>
      <li class="rain-item normal">
        <span class="label">疲劳强度</span>
        <span class="value">{{
          inspectionData.mechanicalProperties.fatigueStrength.value
        }}</span>
        <span class="unit">MPa</span>
      </li>
      <li
        :class="[
          'rain-item',
          inspectionData.tribologicalPerformance.frictionCoefficient.status ===
          '合格'
            ? 'normal'
            : 'warning',
        ]"
      >
        <img
          v-if="
            inspectionData.tribologicalPerformance.frictionCoefficient
              .status !== '合格'
          "
          class="icon"
          :src="alarm"
        />
        <span class="label">摩擦系数</span>
        <span class="value">{{
          inspectionData.tribologicalPerformance.frictionCoefficient.value
        }}</span>
        <span class="unit">μ</span>
      </li>
      <li
        :class="[
          'rain-item',
          inspectionData.mechanicalProperties.compressiveStrength.status ===
          '合格'
            ? 'normal'
            : 'warning',
        ]"
      >
        <img
          v-if="
            inspectionData.mechanicalProperties.compressiveStrength.status !==
            '合格'
          "
          class="icon"
          :src="alarm"
        />
        <span class="label">抗压强度</span>
        <span class="value">{{
          inspectionData.mechanicalProperties.compressiveStrength.value
        }}</span>
        <span class="unit">MPa</span>
      </li>
      <li
        :class="[
          'rain-item',
          inspectionData.materialComposition.bondingStrength.status === '合格'
            ? 'normal'
            : 'warning',
        ]"
      >
        <img
          v-if="
            inspectionData.materialComposition.bondingStrength.status !== '合格'
          "
          class="icon"
          :src="alarm"
        />
        <span class="label">层间结合强度</span>
        <span class="value">{{
          inspectionData.materialComposition.bondingStrength.value
        }}</span>
        <span class="unit">MPa</span>
      </li>
      <li
        :class="[
          'rain-item',
          inspectionData.surfaceQuality.roughness.status === '合格'
            ? 'normal'
            : 'warning',
        ]"
      >
        <img
          v-if="inspectionData.surfaceQuality.roughness.status !== '合格'"
          class="icon"
          :src="alarm"
        />
        <span class="label">表面粗糙度</span>
        <span class="value">{{
          inspectionData.surfaceQuality.roughness.value
        }}</span>
        <span class="unit">Ra</span>
      </li>
    </ul>
  </WidgetPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import alarm from '@/assets/icons/alarm.png'
import { bearingBushInspectionData } from '@/constants/bearingBushInspection'
import WidgetPanel from '../WidgetPanel.vue'

// 使用检测数据
const inspectionData = computed(() => bearingBushInspectionData)
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
