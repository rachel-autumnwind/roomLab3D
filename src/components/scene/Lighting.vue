<script setup lang="ts">
</script>

<template>
  <!-- 环境光 - 提供基础照明 -->
  <TresAmbientLight :intensity="0.4" />

  <!-- 主方向光 - 模拟太阳光，带阴影 -->
  <TresDirectionalLight
    :position="[10, 15, 10]"
    :intensity="1.2"
    :cast-shadow="true"
    :shadow-mapSize-width="2048"
    :shadow-mapSize-height="2048"
    :shadow-camera-far="50"
    :shadow-camera-left="-20"
    :shadow-camera-right="20"
    :shadow-camera-top="20"
    :shadow-camera-bottom="-20"
  />

  <!-- 补光 - 减少阴影过暗 -->
  <TresDirectionalLight
    :position="[-5, 8, -5]"
    :intensity="0.3"
  />

  <!-- 半球光 - 模拟天空和地面的环境反射 -->
  <TresHemisphereLight
    :args="['#87CEEB', '#8B4513', 0.3]"
  />
</template>
