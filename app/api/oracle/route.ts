import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { buildOraclePrompt } from '@/lib/oracle'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { cards, weekNumber = 1, intention = '', previewPersonaWeek, consent } = await request.json()
    
    if (!cards || cards.length !== 3) {
      return Response.json(
        { error: 'Three cards are required for a reading' }, 
        { status: 400 }
      )
    }
    
    const effectiveWeek = typeof previewPersonaWeek === 'number' ? previewPersonaWeek : weekNumber
    const { prompt, snapshot } = await buildOraclePrompt(cards, effectiveWeek, intention, { 
      consent: {
        currentEvents: !!consent?.currentEvents,
        weatherTone: !!consent?.weatherTone,
        calendarHint: consent?.calendarHint || null,
      }
    })
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 900,
      temperature: snapshot.style.temperature,
      messages: [{ role: 'user', content: prompt }]
    })

    const readingText = response.content
      .map(part => (part.type === 'text' ? part.text : ''))
      .join('')
      .trim()
    
    return Response.json({ 
      reading: readingText || 'The Oracle speaks in silence.',
      cards,
      weekNumber: effectiveWeek,
      persona: snapshot.persona,
      act: snapshot.act,
      temperature: snapshot.style.temperature,
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

