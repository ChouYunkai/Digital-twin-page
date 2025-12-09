<template>
  <BaseCollaspse title="孪生控制">
    <BaseCheckbox :value="checked" label="模型拆解" @change="ontoggle" />
    <BaseCheckbox
      :value="modelType === 'bearingBush'"
      label="显示轴瓦模型"
      style="margin-top: 10px"
      @change="onModelToggle"
    />
  </BaseCollaspse>
</template>
<script setup lang="ts">
import BaseCheckbox from '@/components/BaseCheckbox/index.vue'
import BaseCollaspse from '@/components/BaseCollaspse/index.vue'
import { inject, ref, computed } from 'vue'

const turbineActions: any = inject('turbineActions')
const checked = ref(false)
const modelType = computed(
  () => turbineActions?.currentModelType?.value || 'equipment'
)

const ontoggle = () => {
  checked.value = !checked.value

  // console.log('turbineActions', turbineActions)
  if (checked.value) {
    turbineActions.equipmentDecomposeAnimation()
  } else {
    turbineActions.equipmentComposeAnimation()
  }
}

const onModelToggle = () => {
  if (modelType.value === 'equipment') {
    turbineActions.switchToBearingBush()
  } else {
    turbineActions.switchToEquipment()
  }
}
</script>
