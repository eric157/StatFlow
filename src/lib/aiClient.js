import { mapAIToPath, nodesMap } from '../data/decisionMap'

const SYSTEM_PROMPT = [
  'You are a statistical decision assistant.',
  'Return a JSON object with data_type, groups, pairing, normality, recommended_test, and reasoning.',
  'Use the values numerical/categorical, numbers (1,2,3+), independent/paired, normal/not_normal/unknown.',
].join(' ')

const normalizeMessage = (message = '') => message.toLowerCase()

const interpretMessage = (message) => {
  const text = normalizeMessage(message)
  const dataType =
    text.includes('categorical') || text.includes('nominal') || text.includes('binary') ? 'categorical' : 'numerical'
  const pairing = text.includes('paired') || text.includes('matched') ? 'paired' : 'independent'
  let groups = '2'
  if (text.includes('one group') || text.includes('single')) groups = '1'
  else if (text.includes('three') || text.includes('3') || text.includes('more than 2')) groups = '3+'
  const normality = text.includes('non-normal') || text.includes('not normal') || text.includes('skew')
    ? 'not_normal'
    : text.includes('normal')
      ? 'normal'
      : 'unknown'
  return { data_type: dataType, groups, pairing, normality }
}

const buildMockSummary = (aiResult) => {
  const path = mapAIToPath(aiResult)
  const nodeId = path[path.length - 1]
  const leaf = nodesMap[nodeId]
  if (!leaf) {
    return {
      ...aiResult,
      recommended_test: 't-test',
      reasoning: 'Default path (insufficient info).',
    }
  }
  return {
    ...aiResult,
    recommended_test: leaf.label,
    reasoning: `Recommended ${leaf.label} based on the inferred path.`,
  }
}

export const analyzeProblem = async (message) => {
  if (!message) return null
  const endpoint = import.meta.env.VITE_GEMMA_URL
  const apiKey = import.meta.env.VITE_GEMMA_API_KEY

  if (!endpoint || !apiKey) {
    const aiResult = interpretMessage(message)
    return buildMockSummary(aiResult)
  }

  try {
    const baseUrl = endpoint.replace(/\/$/, '')
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemma-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemma responded with ${response.status}`)
    }

    const payload = await response.json()
    const text = payload?.choices?.[0]?.message?.content
    if (!text) throw new Error('Empty completion response')
    return JSON.parse(text)
  } catch (error) {
    console.error('AI analysis failed', error)
    const aiResult = interpretMessage(message)
    return buildMockSummary(aiResult)
  }
}
