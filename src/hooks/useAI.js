const KEY = () => import.meta.env.VITE_CLAUDE_KEY

async function claude(prompt, max = 250) {
  const k = KEY()
  if (!k) return null
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': k, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: max, messages: [{ role: 'user', content: prompt }] }),
    })
    const d = await r.json()
    return d?.content?.[0]?.text || null
  } catch { return null }
}

function parseJSON(text) {
  try { return JSON.parse(text?.replace(/```json|```/g, '').trim()) } catch { return null }
}

// AI Feature 1: Smart Business Match
export async function aiSmartMatch(myProfile, candidates) {
  const list = candidates.slice(0, 15).map(b => `${b.id}|||${b.business_name}|||${b.category}|||${b.address || 'Belgaum'}`).join('\n')
  const res = await claude(`I run "${myProfile.business_name}", a ${myProfile.role} in ${myProfile.category} in Belgaum, India.
Candidate businesses to connect with:
${list}
Pick top 3 matches. Return ONLY a JSON array: [{"id":"...","name":"...","reason":"one sentence why"}]`, 300)
  return parseJSON(res) || []
}

// AI Feature 2: Enquiry Message Writer
export async function aiWriteEnquiry(from, to) {
  const res = await claude(`Write a short, warm, professional first business message from "${from.business_name}" (${from.role}, ${from.category}) to "${to.business_name}" (${to.role}, ${to.category}) in Belgaum, India. Max 2 sentences. No subject line. Just the message body.`, 120)
  return res
}

// AI Feature 3: Business Description Generator
export async function aiGenerateDescription(name, category, role, address) {
  const res = await claude(`Write a compelling 2-sentence business profile for "${name}", a ${role} in the ${category} sector, located in ${address || 'Belgaum'}, Karnataka. Be specific, trustworthy, and professional. No fluff.`, 100)
  return res
}

// AI Feature 4: Market Insight Engine
export async function aiMarketInsight(category, role) {
  const res = await claude(`Give 3 sharp, actionable business tips for a ${role} in the ${category} industry in Belgaum, Karnataka, India. Format as JSON: [{"tip":"...","impact":"high/medium"}]. Be specific to Belgaum market conditions.`, 250)
  return parseJSON(res) || []
}

// AI Feature 5: Smart Search Suggestions
export async function aiSearchSuggest(query, role) {
  const res = await claude(`A ${role} in Belgaum searched "${query}" in a B2B directory. Suggest 4 related search terms as a JSON string array. Short, relevant only.`, 80)
  return parseJSON(res) || []
}

// AI Feature 6: Price Negotiation Opener
export async function aiNegotiationOpener(myBiz, theirBiz, productHint) {
  const res = await claude(`Write a polite price negotiation opening message from "${myBiz.business_name}" (buyer, ${myBiz.category}) to "${theirBiz.business_name}" (supplier) in Belgaum. ${productHint ? `Product: ${productHint}.` : ''} Keep it respectful, mention bulk interest, ask for best price. Max 3 sentences.`, 130)
  return res
}
