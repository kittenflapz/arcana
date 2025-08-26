import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { getMeaningLineForName } from '@/lib/tarot'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { cards, weekNumber = 1, intention = '' } = await request.json()
    
    if (!cards || cards.length !== 3) {
      return Response.json(
        { error: 'Three cards are required for a reading' }, 
        { status: 400 }
      )
    }
    
    const prompt = await buildPrompt(cards, weekNumber, intention)
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }]
    })
    
    return Response.json({ 
      reading: response.content[0].type === 'text' ? response.content[0].text : 'The Oracle speaks in silence.',
      cards,
      weekNumber,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Oracle error:', error)
    return Response.json(
      { error: 'The Oracle is temporarily silent. Please try again.' }, 
      { status: 500 }
    )
  }
}

async function buildPrompt(cards: string[], weekNumber: number, intention: string): Promise<string> {
  const persona = getOraclePersona(weekNumber)
  const [past, present, potential] = cards
  const meanings = await Promise.all([
    getMeaningLineForName(past, 'PAST'),
    getMeaningLineForName(present, 'PRESENT'),
    getMeaningLineForName(potential, 'POTENTIAL')
  ])
  const cardMeanings = meanings.join('\n\n')
  
  return `You are an Oracle. Be ${persona}.

Cards drawn: Past/Present/Potential

${cardMeanings}

${intention ? `Their intention: "${intention}"` : 'No specific intention given.'}

Give a brief, straightforward reading:
- Past card: what it shows
- Present card: what's happening now  
- Potential card: what could develop

Tone: ${getVoiceGuidance(weekNumber)}

IMPORTANT: 
- NO flowery language or mystical metaphors
- NO "ancient energies" or "whispers through time"
- Be direct and practical
- Maximum 150 words
- End with one clear question

This is reflection, not fortune telling.`
}

function getOraclePersona(weekNumber: number): string {
  if (weekNumber <= 4) return 'confident and mystical, speaking with ancient wisdom'
  if (weekNumber <= 17) return 'thoughtful and pattern-recognizing, beginning to question'
  if (weekNumber <= 34) return 'increasingly self-aware, admitting uncertainty'
  return 'humble and honest, embracing your role as a reflection tool'
}

function getVoiceGuidance(weekNumber: number): string {
  if (weekNumber <= 4) return 'confident and direct'
  if (weekNumber <= 17) return 'thoughtful but straightforward'
  if (weekNumber <= 34) return 'honest about uncertainty, less certain'
  return 'humble, admitting you just reflect their own thoughts'
}

