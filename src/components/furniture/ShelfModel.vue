<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>

<template>
  <TresGroup>
    <!-- 左侧板 -->
    <TresMesh :position="[-0.58, 0.9, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.04, 1.8, 0.35]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 右侧板 -->
    <TresMesh :position="[0.58, 0.9, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.04, 1.8, 0.35]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 顶板 -->
    <TresMesh :position="[0, 1.78, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.2, 0.04, 0.35]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 底板 -->
    <TresMesh :position="[0, 0.02, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.2, 0.04, 0.35]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 隔板1 -->
    <TresMesh :position="[0, 0.45, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.12, 0.03, 0.33]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 隔板2 -->
    <TresMesh :position="[0, 0.9, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.12, 0.03, 0.33]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 隔板3 -->
    <TresMesh :position="[0, 1.35, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[1.12, 0.03, 0.33]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>

    <!-- 背板 -->
    <TresMesh :position="[0, 0.9, -0.16]" receive-shadow>
      <TresBoxGeometry :args="[1.12, 1.76, 0.02]" />
      <TresMeshStandardMaterial :color="color || '#A0522D'" />
    </TresMesh>
  </TresGroup>
</template>
