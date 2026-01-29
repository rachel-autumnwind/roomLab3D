import { ref } from 'vue'

export type FurnitureType = 'chair' | 'table' | 'sofa' | 'shelf' | 'ai-model'

export interface Furniture {
  id: number
  type: FurnitureType
  color: string
  position: [number, number, number]
  rotation: number
  modelUrl?: string  // AI 生成模型的 URL
  prompt?: string    // AI 生成时的提示词
}

const furnitureList = ref<Furniture[]>([])
const selectedId = ref<number | null>(null)
let nextId = 1

export function useFurniture() {
  const addFurniture = (type: FurnitureType, color: string, options?: { modelUrl?: string; prompt?: string }) => {
    const randomX = (Math.random() - 0.5) * 6
    const randomZ = (Math.random() - 0.5) * 6
    const randomRotation = Math.random() * Math.PI * 2

    furnitureList.value.push({
      id: nextId++,
      type,
      color,
      position: [randomX, 0, randomZ],
      rotation: randomRotation,
      modelUrl: options?.modelUrl,
      prompt: options?.prompt
    })
  }

  const removeFurniture = (id: number) => {
    const index = furnitureList.value.findIndex(f => f.id === id)
    if (index !== -1) {
      furnitureList.value.splice(index, 1)
      if (selectedId.value === id) {
        selectedId.value = null
      }
    }
  }

  const clearAll = () => {
    furnitureList.value = []
    selectedId.value = null
  }

  const selectFurniture = (id: number | null) => {
    selectedId.value = id
  }

  const updatePosition = (id: number, position: [number, number, number]) => {
    const furniture = furnitureList.value.find(f => f.id === id)
    if (furniture) {
      furniture.position = position
    }
  }

  const updateRotation = (id: number, rotation: number) => {
    const furniture = furnitureList.value.find(f => f.id === id)
    if (furniture) {
      furniture.rotation = rotation
    }
  }

  return {
    furnitureList,
    selectedId,
    addFurniture,
    removeFurniture,
    clearAll,
    selectFurniture,
    updatePosition,
    updateRotation
  }
}
