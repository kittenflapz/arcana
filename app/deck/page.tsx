'use client'

import { useEffect, useMemo, useState } from 'react'
import { TarotCardComponent } from '@/components/tarot-card'
import type { TarotCard } from '@/lib/tarot'
import { getDeck } from '@/lib/tarot'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function DeckPage() {
  const [deck, setDeck] = useState<TarotCard[]>([])
  const [query, setQuery] = useState('')
  const [randomCard, setRandomCard] = useState<TarotCard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const cards = await getDeck(true)
        if (mounted) {
          setDeck(cards)
          setLoading(false)
        }
      } catch (_) {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return deck
    return deck.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q)) ||
      c.meaning.toLowerCase().includes(q)
    )
  }, [deck, query])

  const grouped = useMemo(() => {
    const groups: Array<{ key: string, title: string, cards: TarotCard[] }> = []
    const majors = filtered.filter(c => c.arcana === 'major')
    if (majors.length) groups.push({ key: 'major', title: 'Major Arcana', cards: majors })
    const suitOrder: Array<{ id: NonNullable<TarotCard['suit']>, title: string }> = [
      { id: 'wands', title: 'Wands' },
      { id: 'cups', title: 'Cups' },
      { id: 'swords', title: 'Swords' },
      { id: 'pentacles', title: 'Pentacles' }
    ]
    for (const s of suitOrder) {
      const cards = filtered.filter(c => c.arcana === 'minor' && c.suit === s.id)
      if (cards.length) groups.push({ key: s.id, title: `${s.title}`, cards })
    }
    return groups
  }, [filtered])

  const handleDrawRandom = () => {
    if (deck.length === 0) return
    const idx = Math.floor(Math.random() * deck.length)
    setRandomCard(deck[idx])
  }

  return (
    <div className="min-h-screen bg-arcana-gradient p-4">
      <div className="max-w-6xl mx-auto py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-serif text-white mb-2">The Deck</h1>
          <p className="text-arcana-secondary">Browse every card or search by name/keyword.</p>
        </header>

        {/* Random card draw */}
        <Card className="bg-arcana-surface border-arcana-primary p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-serif text-white mb-2">Random Card</h2>
              <p className="text-arcana-secondary text-sm">Draw a single card for a quick reflection.</p>
            </div>
            <div className="text-center">
              <Button onClick={handleDrawRandom} className="btn-arcana-primary px-6">Draw Random Card</Button>
            </div>
          </div>
          {randomCard && (
            <div className="mt-6 flex justify-center">
              <TarotCardComponent card={randomCard} isRevealed={true} position="Random" />
            </div>
          )}
        </Card>

        {/* Search */}
        <Card className="bg-arcana-surface border-arcana-primary p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search cards by name or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-arcana-surface-hover border-arcana-secondary text-white placeholder:text-arcana-muted"
              />
            </div>
            <div className="text-arcana-secondary text-sm text-center md:text-right">
              {loading ? 'Loading deck…' : `${filtered.length} of ${deck.length} cards`}
            </div>
          </div>
        </Card>

        {/* Grouped sections with sticky headers */}
        <div className="space-y-10">
          {grouped.map(group => (
            <section key={group.key}>
              <div className="sticky top-16 z-10">
                <div className="bg-arcana-surface-hover/80 backdrop-blur-md border border-arcana-secondary rounded-md px-4 py-2 shadow-sm">
                  <h3 className="text-white font-serif text-lg flex items-center justify-between">
                    <span>{group.title}</span>
                    <span className="text-arcana-secondary text-sm">{group.cards.length}</span>
                  </h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {group.cards.map(card => (
                  <div key={card.id} className="flex justify-center">
                    <TarotCardComponent card={card} isRevealed={true} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}


