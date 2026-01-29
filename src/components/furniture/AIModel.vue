<script setup lang="ts">
import { shallowRef, watch, onMounted } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import type { Object3D } from 'three'

const props = defineProps<{
  modelUrl: string
}>()

const modelRef = shallowRef<Object3D | null>(null)
const isLoading = shallowRef(true)
const loadError = shallowRef<string | null>(null)

async function loadModel() {
  if (!props.modelUrl) return

  isLoading.value = true
  loadError.value = null

  try {
    const { scene } = await useGLTF(props.modelUrl)
    modelRef.value = scene

    // 调整模型大小和位置
    scene.scale.set(0.5, 0.5, 0.5)
    scene.position.y = 0.5
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadModel)

watch(() => props.modelUrl, loadModel)
</script>

<template>
  <TresGroup>
    <!-- 加载中显示占位方块 -->
    <TresMesh v-if="isLoading" :position="[0, 0.5, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.5, 0.5, 0.5]" />
      <TresMeshStandardMaterial color="#805ad5" :wireframe="true" />
    </TresMesh>

    <!-- 加载失败显示红色方块 -->
    <TresMesh v-else-if="loadError" :position="[0, 0.5, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.5, 0.5, 0.5]" />
      <TresMeshStandardMaterial color="#e53e3e" />
    </TresMesh>

    <!-- 加载成功显示模型 -->
    <primitive v-else-if="modelRef" :object="modelRef" />
  </TresGroup>
</template>
