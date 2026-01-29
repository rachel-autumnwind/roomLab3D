import { ref } from 'vue'

export interface GenerationResult {
  success: boolean
  modelUrl?: string
  error?: string
}

const isGenerating = ref(false)
const generationError = ref<string | null>(null)

// Meshy API - 免费额度每月 200 积分
// 在 .env 中设置 VITE_MESHY_API_KEY
const MESHY_API_URL = 'https://api.meshy.ai/v1'

export function useAIModelGenerator() {
  async function generateModel(prompt: string): Promise<GenerationResult> {
    if (!prompt.trim()) {
      return { success: false, error: '请输入描述' }
    }

    const apiKey = import.meta.env.VITE_MESHY_API_KEY
    if (!apiKey) {
      return {
        success: false,
        error: '请在 .env 文件中设置 VITE_MESHY_API_KEY'
      }
    }

    isGenerating.value = true
    generationError.value = null

    try {
      // Step 1: 创建生成任务
      const createRes = await fetch(`${MESHY_API_URL}/text-to-3d`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: 'preview',
          prompt,
          art_style: 'realistic',
          negative_prompt: 'low quality, blurry'
        })
      })

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err.message || `创建任务失败: ${createRes.status}`)
      }

      const { result: taskId } = await createRes.json()

      // Step 2: 轮询任务状态
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

      const res = await fetch(`${MESHY_API_URL}/text-to-3d/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })

      if (!res.ok) continue

      const task = await res.json()

      if (task.status === 'SUCCEEDED') {
        // 返回 GLB 格式的模型 URL
        return task.model_urls?.glb || task.model_url
      }

      if (task.status === 'FAILED') {
        throw new Error(task.message || '生成失败')
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
