'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TarotCardComponent } from '@/components/tarot-card'
import { drawThreeCards, type TarotCard } from '@/lib/tarot'

export default function TestOracle() {
  const [reading, setReading] = useState('')
  const [loading, setLoading] = useState(false)
  const [intention, setIntention] = useState('')
  const [cards, setCards] = useState<TarotCard[] | null>(null)
  const [previewWeek, setPreviewWeek] = useState<number>(1)

  const drawCards = () => {
    const drawnCards = drawThreeCards()
    setCards(drawnCards)
    setReading('')
  }

  const testReading = async () => {
    if (!cards) {
      drawCards()
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cards.map(c => c.name),
          weekNumber: 1,
          previewPersonaWeek: previewWeek,
          intention: intention || 'Testing the Oracle connection'
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      setReading(data.reading)
    } catch (error) {
      console.error('Error:', error)
      setReading(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testWeek20Reading = async () => {
    if (!cards) {
      drawCards()
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cards.map(c => c.name),
          weekNumber: 20,
          previewPersonaWeek: previewWeek,
          intention: intention || 'Testing evolved Oracle personality'
        })
      })
      
      const data = await response.json()
      setReading(data.reading)
    } catch (error) {
      setReading('Error: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-arcana-gradient p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-white text-center mb-8">
          Oracle Test Chamber
        </h1>
        
        <Card className="bg-arcana-surface border-arcana-secondary p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="intention" className="text-arcana-secondary">
                Test Intention (Optional)
              </Label>
              <Textarea
                id="intention"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What are you testing?"
                className="bg-arcana-surface border-arcana-secondary text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="previewWeek" className="text-arcana-secondary">
                Persona Preview Week
              </Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  id="previewWeek"
                  type="number"
                  min={1}
                  max={52}
                  value={previewWeek}
                  onChange={(e) => {
                    const next = parseInt(e.target.value || '1', 10)
                    setPreviewWeek(Number.isFinite(next) ? Math.max(1, Math.min(52, next)) : 1)
                  }}
                  className="w-28 bg-arcana-surface border-arcana-secondary text-white"
                />
                <p className="text-arcana-tertiary text-sm">Preview the Oracle’s voice for any week (1–52)</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              {!cards ? (
                <Button 
                  onClick={drawCards} 
                  disabled={loading}
                  className="flex-1"
                >
                  Draw Three Cards
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={testReading} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Consulting Oracle...' : `Preview Week ${previewWeek}`}
                  </Button>
                  
                  <Button 
                    onClick={testWeek20Reading} 
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    Week 20 Reading
                  </Button>
                  
                  <Button 
                    onClick={drawCards} 
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    New Cards
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
        
        {cards && (
          <div className="mb-8">
            <h2 className="text-2xl text-white text-center mb-8 font-serif">Your Three Cards</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <TarotCardComponent 
                  card={cards[0]} 
                  isRevealed={false}
                  position="Past"
                />
              </div>
              <div className="flex flex-col items-center">
                <TarotCardComponent 
                  card={cards[1]} 
                  isRevealed={false}
                  position="Present"
                />
              </div>
              <div className="flex flex-col items-center">
                <TarotCardComponent 
                  card={cards[2]} 
                  isRevealed={false}
                  position="Potential"
                />
              </div>
            </div>
          </div>
        )}
        
        {reading && (
          <Card className="bg-arcana-surface border-arcana-secondary p-6">
            <h2 className="text-xl text-arcana-secondary mb-4">Oracle Response:</h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-arcana-primary leading-relaxed whitespace-pre-wrap">
                {reading}
              </p>
            </div>
          </Card>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-arcana-tertiary text-sm">
            Cards being tested: The Fool, The Magician, The Sun (Week 1) | The Hermit, Wheel of Fortune, The Star (Week 20)
          </p>
        </div>
      </div>
    </div>
  )
}
