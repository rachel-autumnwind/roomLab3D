<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>

<template>
  <TresGroup>
    <!-- 座垫 -->
    <TresMesh :position="[0, 0.35, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.8, 0.25, 0.8]" />
      <TresMeshStandardMaterial :color="color || '#4A5568'" />
    </TresMesh>

    <!-- 靠背 -->
    <TresMesh :position="[0, 0.7, -0.32]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.8, 0.5, 0.15]" />
      <TresMeshStandardMaterial :color="color || '#4A5568'" />
    </TresMesh>

    <!-- 左扶手 -->
    <TresMesh :position="[-0.85, 0.55, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.1, 0.15, 0.7]" />
      <TresMeshStandardMaterial :color="color || '#4A5568'" />
    </TresMesh>

    <!-- 右扶手 -->
    <TresMesh :position="[0.85, 0.55, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.1, 0.15, 0.7]" />
      <TresMeshStandardMaterial :color="color || '#4A5568'" />
    </TresMesh>

    <!-- 底座/脚 -->
    <TresMesh :position="[-0.7, 0.08, 0.25]" cast-shadow>
      <TresBoxGeometry :args="[0.12, 0.16, 0.12]" />
      <TresMeshStandardMaterial color="#2D3748" />
    </TresMesh>
    <TresMesh :position="[0.7, 0.08, 0.25]" cast-shadow>
      <TresBoxGeometry :args="[0.12, 0.16, 0.12]" />
      <TresMeshStandardMaterial color="#2D3748" />
    </TresMesh>
    <TresMesh :position="[-0.7, 0.08, -0.25]" cast-shadow>
      <TresBoxGeometry :args="[0.12, 0.16, 0.12]" />
      <TresMeshStandardMaterial color="#2D3748" />
    </TresMesh>
    <TresMesh :position="[0.7, 0.08, -0.25]" cast-shadow>
      <TresBoxGeometry :args="[0.12, 0.16, 0.12]" />
      <TresMeshStandardMaterial color="#2D3748" />
    </TresMesh>
  </TresGroup>
</template>
