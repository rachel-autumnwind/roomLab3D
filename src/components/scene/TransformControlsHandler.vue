<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { useTresContext } from '@tresjs/core'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import type { Object3D } from 'three'

const props = defineProps<{
  selectedId: number | null
  furnitureRefs: Record<number, { groupRef: Object3D | null }>
}>()

const emit = defineEmits<{
  'update-position': [id: number, position: [number, number, number]]
}>()

const { camera, renderer, controls, scene } = useTresContext()
let transformControls: TransformControls | null = null

onMounted(() => {
  if (!camera.value || !renderer.value) return

  transformControls = new TransformControls(camera.value, renderer.value.domElement)
  transformControls.setMode('translate')
  transformControls.showY = false

  scene.value?.add(transformControls)

  transformControls.addEventListener('dragging-changed', (event: unknown) => {
    const dragEvent = event as { value: boolean }
    if (controls.value) {
      (controls.value as any).enabled = !dragEvent.value
    }
  })

  transformControls.addEventListener('objectChange', () => {
    if (props.selectedId && transformControls?.object) {
      const pos = transformControls.object.position
      emit('update-position', props.selectedId, [pos.x, 0, pos.z])
    }
  })

  // 初始化时如果已有选中
  if (props.selectedId) {
    const ref = props.furnitureRefs[props.selectedId]
    if (ref?.groupRef) {
      transformControls.attach(ref.groupRef)
    }
  }
})

watch(() => props.selectedId, (newId) => {
  if (!transformControls) return

  if (newId) {
    const ref = props.furnitureRefs[newId]
    if (ref?.groupRef) {
      transformControls.attach(ref.groupRef)
    }
  } else {
    transformControls.detach()
  }
})

// 监听 furnitureRefs 变化
watch(() => props.furnitureRefs, () => {
  if (!transformControls || !props.selectedId) return
  const ref = props.furnitureRefs[props.selectedId]
  if (ref?.groupRef) {
    transformControls.attach(ref.groupRef)
  }
}, { deep: true })

onUnmounted(() => {
  if (transformControls) {
    transformControls.detach()
    scene.value?.remove(transformControls)
    transformControls.dispose()
  }
})
</script>

<template>
  <slot />
</template>
