<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFurniture, type FurnitureType } from '@/composables/useFurniture'
import { useAIModelGenerator } from '@/services/ai-model-generator'

const { addFurniture, removeFurniture, clearAll, furnitureList, selectedId } = useFurniture()
const { generateModel, isGenerating, generationError } = useAIModelGenerator()

const furnitureType = ref<FurnitureType>('chair')
const furnitureColor = ref('#8B4513')
const aiPrompt = ref('')

const furnitureTypes = [
  { value: 'chair', label: '椅子' },
  { value: 'table', label: '桌子' },
  { value: 'sofa', label: '沙发' },
  { value: 'shelf', label: '书架' },
]

const selectedFurniture = computed(() => {
  if (!selectedId.value) return null
  return furnitureList.value.find(f => f.id === selectedId.value)
})

const generateFurniture = () => {
  addFurniture(furnitureType.value, furnitureColor.value)
}

const generateAIModel = async () => {
  if (!aiPrompt.value.trim()) return

  const result = await generateModel(aiPrompt.value)
  if (result.success && result.modelUrl) {
    addFurniture('ai-model', '#ffffff', {
      modelUrl: result.modelUrl,
      prompt: aiPrompt.value
    })
    aiPrompt.value = ''
  }
}

const deleteSelected = () => {
  if (selectedId.value) {
    removeFurniture(selectedId.value)
  }
}
</script>

<template>
  <div class="control-panel">
    <h2>创意家具生成器</h2>

    <div class="control-group">
      <label>家具类型</label>
      <select v-model="furnitureType">
        <option
          v-for="type in furnitureTypes"
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
    </div>

    <div class="control-group">
      <label>颜色</label>
      <input type="color" v-model="furnitureColor" />
    </div>

    <button class="btn" @click="generateFurniture">
      生成家具
    </button>

    <!-- AI 生成区域 -->
    <div class="ai-section">
      <h3>AI 生成 (Meshy)</h3>
      <input
        v-model="aiPrompt"
        type="text"
        placeholder="描述你想要的物品，如: a chair"
        class="ai-input"
        :disabled="isGenerating"
        @keyup.enter="generateAIModel"
      />
      <button
        class="btn btn-ai"
        @click="generateAIModel"
        :disabled="isGenerating || !aiPrompt.trim()"
      >
        {{ isGenerating ? '生成中...' : 'AI 生成' }}
      </button>
      <div v-if="generationError" class="error-msg">
        {{ generationError }}
      </div>
    </div>

    <div class="furniture-count">
      已生成: {{ furnitureList.length }} 件家具
    </div>

    <!-- 选中家具信息 -->
    <div v-if="selectedFurniture" class="selected-info">
      <div class="selected-label">已选中: {{ furnitureTypes.find(t => t.value === selectedFurniture.type)?.label }}</div>
      <button class="btn btn-danger" @click="deleteSelected">
        删除选中
      </button>
    </div>

    <div v-else class="hint">
      点击家具可选中并拖拽移动
    </div>

    <button
      v-if="furnitureList.length > 0"
      class="btn btn-secondary"
      @click="clearAll"
    >
      清空全部
    </button>
  </div>
</template>

<style scoped>
.furniture-count {
  margin: 16px 0 8px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.selected-info {
  background: #EEF2FF;
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
}

.selected-label {
  font-size: 14px;
  color: #4f46e5;
  margin-bottom: 8px;
  font-weight: 500;
}

.hint {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 8px 0;
}

.btn-secondary {
  background: #718096;
  margin-top: 8px;
}

.btn-secondary:hover {
  background: #4A5568;
}

.btn-danger {
  background: #E53E3E;
}

.btn-danger:hover {
  background: #C53030;
}

.ai-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.ai-section h3 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #4a5568;
}

.ai-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.ai-input:focus {
  outline: none;
  border-color: #805ad5;
}

.btn-ai {
  background: linear-gradient(135deg, #805ad5, #6b46c1);
  width: 100%;
}

.btn-ai:hover:not(:disabled) {
  background: linear-gradient(135deg, #6b46c1, #553c9a);
}

.btn-ai:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}
</style>
