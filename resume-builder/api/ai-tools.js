export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY' })
  }

  try {
    const { prompt, tool } = req.body

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided' })
    }
    
    if (prompt.length > 8000) {
      return res.status(400).json({ error: 'Prompt too long (max 8000 characters)' })
    }

    // A simple in-memory rate limit could be implemented here, but since Vercel functions are stateless,
    // a proper implementation would use Edge config or Redis (Upstash). For this scope, we just pass through.
    // If we wanted to do a simple memory map, it would only work per-instance.

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.error('Gemini API error:', errData)
      return res.status(502).json({ error: 'AI service unavailable' })
    }

    const data = await response.json()
    
    // Safety check for response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Unexpected Gemini API response format:', data)
      return res.status(500).json({ error: 'Failed to parse AI response' })
    }
    
    const text = data.candidates[0].content.parts[0].text

    return res.status(200).json({ text })
  } catch (err) {
    console.error('Proxy handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
