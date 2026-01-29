<script setup lang="ts">
import { shallowRef } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import Lighting from './Lighting.vue'
import DraggableFurniture from '../furniture/DraggableFurniture.vue'
import TransformControlsHandler from './TransformControlsHandler.vue'
import { useFurniture } from '@/composables/useFurniture'
import type { Object3D } from 'three'

const { furnitureList, selectedId, selectFurniture, updatePosition } = useFurniture()

const furnitureRefs = shallowRef<Record<number, { groupRef: Object3D | null }>>({})

const onFurnitureSelect = (id: number) => {
  selectFurniture(id)
}

const onGroundClick = () => {
  selectFurniture(null)
}

const setFurnitureRef = (id: number, ref: { groupRef: Object3D | null } | null) => {
  if (ref) {
    furnitureRefs.value = { ...furnitureRefs.value, [id]: ref }
  } else {
    const newRefs = { ...furnitureRefs.value }
    delete newRefs[id]
    furnitureRefs.value = newRefs
  }
}

const onUpdatePosition = (id: number, pos: [number, number, number]) => {
  updatePosition(id, pos)
}
</script>

<template>
  <TresCanvas
    clear-color="#f0f0f0"
    shadows
    alpha
    window-size
  >
    <TresPerspectiveCamera
      :position="[8, 6, 8]"
      :look-at="[0, 0, 0]"
    />
    <OrbitControls
      make-default
      :enable-damping="true"
      :damping-factor="0.05"
      :max-polar-angle="Math.PI / 2 - 0.1"
    />

    <Lighting />

    <!-- 可点击的地面 -->
    <TresMesh
      :rotation="[-Math.PI / 2, 0, 0]"
      :position="[0, 0, 0]"
      receive-shadow
      @click="onGroundClick"
    >
      <TresPlaneGeometry :args="[30, 30]" />
      <TresMeshStandardMaterial
        color="#e8e8e8"
        :roughness="0.8"
        :metalness="0.1"
      />
    </TresMesh>

    <!-- 网格辅助线 -->
    <TresGridHelper
      :args="[30, 30, '#cccccc', '#dddddd']"
      :position="[0, 0.01, 0]"
    />

    <!-- 渲染可拖拽家具 -->
    <DraggableFurniture
      v-for="furniture in furnitureList"
      :key="furniture.id"
      :ref="(el) => setFurnitureRef(furniture.id, el as any)"
      :furniture="furniture"
      @select="onFurnitureSelect"
    />

    <!-- TransformControls 处理器 -->
    <TransformControlsHandler
      :selected-id="selectedId"
      :furniture-refs="furnitureRefs"
      @update-position="onUpdatePosition"
    />
  </TresCanvas>
</template>
