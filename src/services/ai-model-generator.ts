import { ref } from 'vue'

export interface GenerationResult {
  success: boolean
  modelUrl?: string
  error?: string
}

const isGenerating = ref(false)
const generationError = ref<string | null>(null)

// Tripo AI API - 新用户有免费额度
// 在 .env 中设置 VITE_TRIPO_API_KEY
// 如果没有 API Key，将使用 mock 模式
const TRIPO_API_URL = 'https://api.tripo3d.ai/v2/openapi'

// Mock 模式使用的免费 3D 模型（来自 Khronos glTF 示例库）
const MOCK_MODELS = [
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF-Binary/Duck.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Avocado/glTF-Binary/Avocado.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/SheenChair/glTF-Binary/SheenChair.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb'
]

function selectMockModel(prompt: string): string {
  // 根据 prompt 关键词选择合适的模型
  const lowerPrompt = prompt.toLowerCase()
  if (lowerPrompt.includes('椅') || lowerPrompt.includes('chair')) {
    return MOCK_MODELS[3]
  }
  if (lowerPrompt.includes('车') || lowerPrompt.includes('car')) {
    return MOCK_MODELS[4]
  }
  if (lowerPrompt.includes('盒') || lowerPrompt.includes('box')) {
    return MOCK_MODELS[1]
  }
  // 默认随机返回一个
  return MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)]
}

async function mockGenerate(prompt: string): Promise<string> {
  // 模拟 AI 生成延迟（2-4秒）
  const delay = 2000 + Math.random() * 2000
  await new Promise(r => setTimeout(r, delay))
  return selectMockModel(prompt)
}

export function useAIModelGenerator() {
  async function generateModel(prompt: string): Promise<GenerationResult> {
    if (!prompt.trim()) {
      return { success: false, error: '请输入描述' }
    }

    const apiKey = import.meta.env.VITE_TRIPO_API_KEY
    const useMock = !apiKey || apiKey === 'your_api_key_here'

    isGenerating.value = true
    generationError.value = null

    try {
      // Mock 模式
      if (useMock) {
        console.log('[AI Generator] 使用 Mock 模式')
        const modelUrl = await mockGenerate(prompt)
        return { success: true, modelUrl }
      }

      // 真实 Tripo API 模式
      const createRes = await fetch(`${TRIPO_API_URL}/task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'text_to_model',
          prompt,
          negative_prompt: 'low quality, blurry, distorted',
          model_version: 'v2.5'
        })
      })

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err.message || `创建任务失败: ${createRes.status}`)
      }

      const result = await createRes.json()

      if (result.code !== 0) {
        throw new Error(result.message || '创建任务失败')
      }

      const taskId = result.data.task_id

      const modelUrl = await pollTaskStatus(taskId, apiKey)
      return { success: true, modelUrl }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '生成失败'
      generationError.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isGenerating.value = false
    }
  }

  async function pollTaskStatus(taskId: string, apiKey: string): Promise<string> {
    const maxAttempts = 60

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 3000))

      const res = await fetch(`${TRIPO_API_URL}/task/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })

      if (!res.ok) continue

      const result = await res.json()

      if (result.code !== 0) continue

      const task = result.data

      if (task.status === 'success') {
        // 返回 GLB 格式的模型 URL
        return task.output?.model || task.output?.pbr_model
      }

      if (task.status === 'failed') {
        throw new Error('生成失败')
      }
    }

    throw new Error('生成超时，请稍后重试')
  }

  return {
    generateModel,
    isGenerating,
    generationError
  }
}
