// AI hook - calls Claude API for smart features
export async function callClaude(prompt, maxTokens = 300) {
  const apiKey = import.meta.env.VITE_CLAUDE_KEY
  if (!apiKey) return null
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json()
    return data?.content?.[0]?.text || null
  } catch {
    return null
  }
}

export async function generateBusinessDescription(name, category, role) {
  return callClaude(
    `Write a 2-sentence professional business profile for "${name}", a ${role} in the ${category} industry based in Belgaum, Karnataka, India. Be specific and business-focused. No fluff.`,
    120
  )
}

export async function getSmartMatches(myProfile, businesses) {
  const list = businesses.slice(0, 20).map(b => `${b.business_name} (${b.category})`).join(', ')
  const result = await callClaude(
    `I run "${myProfile.business_name}", a ${myProfile.role} in ${myProfile.category} in Belgaum. From this list of businesses: ${list}. Suggest the top 3 most relevant ones to connect with and briefly explain why each is a good match. Format as JSON array: [{"name":"...","reason":"..."}]`,
    300
  )
  try {
    const clean = result?.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch { return [] }
}

export async function generateEnquiryMessage(fromBusiness, toBusiness) {
  return callClaude(
    `Write a professional, friendly first-contact message from "${fromBusiness.business_name}" (${fromBusiness.role}, ${fromBusiness.category}) to "${toBusiness.business_name}" (${toBusiness.role}, ${toBusiness.category}) in Belgaum. Keep it under 3 sentences. Be warm but professional.`,
    150
  )
}

export async function getMarketInsight(category, role) {
  return callClaude(
    `Give 2 short, practical business tips for a ${role} in the ${category} industry in Belgaum, Karnataka. Each tip should be 1 sentence. Format: plain text, numbered 1. and 2.`,
    150
  )
}

export async function smartSearchSuggest(query, role) {
  return callClaude(
    `A ${role} in Belgaum typed "${query}" in a B2B search. Suggest 4 related search terms they might want as a JSON array of strings. Short terms only.`,
    100
  )
}
