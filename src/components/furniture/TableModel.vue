<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>

<template>
  <TresGroup>
    <!-- 桌面 -->
    <TresMesh :position="[0, 0.75, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.2, 0.06, 0.8]" />
      <TresMeshStandardMaterial :color="color || '#DEB887'" />
    </TresMesh>

    <!-- 四条腿 -->
    <TresMesh :position="[-0.5, 0.36, 0.3]" cast-shadow>
      <TresBoxGeometry :args="[0.06, 0.72, 0.06]" />
      <TresMeshStandardMaterial :color="color || '#DEB887'" />
    </TresMesh>
    <TresMesh :position="[0.5, 0.36, 0.3]" cast-shadow>
      <TresBoxGeometry :args="[0.06, 0.72, 0.06]" />
      <TresMeshStandardMaterial :color="color || '#DEB887'" />
    </TresMesh>
    <TresMesh :position="[-0.5, 0.36, -0.3]" cast-shadow>
      <TresBoxGeometry :args="[0.06, 0.72, 0.06]" />
      <TresMeshStandardMaterial :color="color || '#DEB887'" />
    </TresMesh>
    <TresMesh :position="[0.5, 0.36, -0.3]" cast-shadow>
      <TresBoxGeometry :args="[0.06, 0.72, 0.06]" />
      <TresMeshStandardMaterial :color="color || '#DEB887'" />
    </TresMesh>
  </TresGroup>
</template>
