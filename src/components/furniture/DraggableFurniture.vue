<script setup lang="ts">
import { ref, watch, shallowRef, computed } from 'vue'
import { useFurniture, type Furniture } from '@/composables/useFurniture'
import ChairModel from './ChairModel.vue'
import TableModel from './TableModel.vue'
import SofaModel from './SofaModel.vue'
import ShelfModel from './ShelfModel.vue'
import AIModel from './AIModel.vue'
import type { Group, Mesh } from 'three'

const props = defineProps<{
  furniture: Furniture
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const { selectedId, updatePosition } = useFurniture()

const groupRef = shallowRef<Group | null>(null)
const hitboxRef = shallowRef<Mesh | null>(null)

const isSelected = computed(() => selectedId.value === props.furniture.id)

// 根据家具类型设置碰撞盒大小
const hitboxSize = computed(() => {
  switch (props.furniture.type) {
    case 'sofa': return [2, 1, 1]
    case 'table': return [1.3, 0.8, 0.9]
    case 'chair': return [0.6, 1.2, 0.6]
    case 'shelf': return [1.3, 1.9, 0.5]
    case 'ai-model': return [1, 1, 1]
    default: return [1, 1, 1]
  }
})

const hitboxPosition = computed(() => {
  switch (props.furniture.type) {
    case 'sofa': return [0, 0.5, 0]
    case 'table': return [0, 0.4, 0]
    case 'chair': return [0, 0.6, 0]
    case 'shelf': return [0, 0.9, 0]
    case 'ai-model': return [0, 0.5, 0]
    default: return [0, 0.5, 0]
  }
})

const onHitboxClick = (event: { stopPropagation?: () => void }) => {
  event.stopPropagation?.()
  emit('select', props.furniture.id)
}

// 同步位置到状态
watch(() => groupRef.value?.position, (pos) => {
  if (pos && isSelected.value) {
    // 位置会通过 TransformControls 更新
  }
}, { deep: true })

defineExpose({
  groupRef
})
</script>

<template>
  <TresGroup
    ref="groupRef"
    :position="[...furniture.position]"
    :rotation="[0, furniture.rotation, 0]"
  >
    <!-- 透明碰撞盒用于点击检测 -->
    <TresMesh
      ref="hitboxRef"
      :position="hitboxPosition"
      @click="onHitboxClick"
    >
      <TresBoxGeometry :args="hitboxSize" />
      <TresMeshBasicMaterial
        :visible="false"
      />
    </TresMesh>

    <!-- 选中高亮底座 -->
    <TresMesh
      v-if="isSelected"
      :position="[0, 0.02, 0]"
      :rotation="[-Math.PI / 2, 0, 0]"
    >
      <TresCircleGeometry :args="[1.5, 32]" />
      <TresMeshBasicMaterial
        color="#4f46e5"
        :opacity="0.3"
        :transparent="true"
        :depth-write="false"
      />
    </TresMesh>

    <ChairModel v-if="furniture.type === 'chair'" :color="furniture.color" />
    <TableModel v-if="furniture.type === 'table'" :color="furniture.color" />
    <SofaModel v-if="furniture.type === 'sofa'" :color="furniture.color" />
    <ShelfModel v-if="furniture.type === 'shelf'" :color="furniture.color" />
    <AIModel v-if="furniture.type === 'ai-model' && furniture.modelUrl" :model-url="furniture.modelUrl" />
  </TresGroup>
</template>
