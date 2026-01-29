<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>

<template>
  <TresGroup>
    <!-- 座面 -->
    <TresMesh :position="[0, 0.45, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.5, 0.08, 0.5]" />
      <TresMeshStandardMaterial :color="color || '#8B4513'" />
    </TresMesh>

    <!-- 靠背 -->
    <TresMesh :position="[0, 0.85, -0.21]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.5, 0.7, 0.06]" />
      <TresMeshStandardMaterial :color="color || '#8B4513'" />
    </TresMesh>

    <!-- 四条腿 -->
    <TresMesh :position="[-0.18, 0.2, 0.18]" cast-shadow>
      <TresCylinderGeometry :args="[0.025, 0.025, 0.4, 8]" />
      <TresMeshStandardMaterial :color="color || '#8B4513'" />
    </TresMesh>
    <TresMesh :position="[0.18, 0.2, 0.18]" cast-shadow>
      <TresCylinderGeometry :args="[0.025, 0.025, 0.4, 8]" />
      <TresMeshStandardMaterial :color="color || '#8B4513'" />
    </TresMesh>
    <TresMesh :position="[-0.18, 0.2, -0.18]" cast-shadow>
      <TresCylinderGeometry :args="[0.025, 0.025, 0.4, 8]" />
      <TresMeshStandardMaterial :color="color || '#8B4513'" />
    </TresMesh>
    <TresMesh :position="[0.18, 0.2, -0.18]" cast-shadow>
      <TresCylinderGeometry :args="[0.025, 0.025, 0.4, 8]" />
      <TresMeshStandardMaterial :color="color || '#8B4513'" />
    </TresMesh>
  </TresGroup>
</template>
