<script setup lang="ts">
import { DoubleSide } from 'three'
</script>

<template>
  <!-- 地面平面 -->
  <TresMesh
    :rotation="[-Math.PI / 2, 0, 0]"
    :position="[0, 0, 0]"
    :receive-shadow="true"
  >
    <TresPlaneGeometry :args="[30, 30]" />
    <TresMeshStandardMaterial
      color="#e8e8e8"
      :side="DoubleSide"
      :roughness="0.8"
      :metalness="0.1"
    />
  </TresMesh>

  <!-- 网格辅助线 -->
  <TresGridHelper
    :args="[30, 30, '#cccccc', '#dddddd']"
    :position="[0, 0.01, 0]"
  />
</template>
