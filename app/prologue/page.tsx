'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useArcana } from '@/lib/store'
import { TarotCardComponent } from '@/components/tarot-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCardsByArcana, getRandomCard, drawThreeCards, type TarotCard } from '@/lib/tarot'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Prologue() {
  const { hasBegun, currentDay } = useArcana()
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null)
  const [practiceReading, setPracticeReading] = useState<TarotCard[] | null>(null)
  const [showAllCards, setShowAllCards] = useState(false)

  // Redirect active journey users to their current day
  useEffect(() => {
    if (hasBegun) {
      if (currentDay === 0) {
        router.push('/waiting-for-dawn')
      } else {
        router.push('/daily')
      }
    }
  }, [hasBegun, currentDay, router])

  const handlePracticeReading = () => {
    const cards = drawThreeCards()
    setPracticeReading(cards)
  }

  const majorArcana = getCardsByArcana('major')

  return (
    <div className="min-h-screen bg-arcana-gradient">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header with clear no-commitment messaging */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white mb-4">
            The Prologue
          </h1>
          <p className="text-xl text-arcana-secondary max-w-2xl mx-auto mb-2">
            Explore freely. Learn the cards. Feel the rhythm.
          </p>
          <p className="text-arcana-muted text-sm">
            Your year has not yet begun. This is just curiosity.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Left: Card Exploration */}
          <div>
            <h2 className="text-2xl font-serif text-white mb-6">
              Discover the Arcana
            </h2>
            
            {!showAllCards ? (
              <div className="space-y-6">
                <Card className="bg-arcana-surface border-arcana-primary p-6">
                  <div className="text-center">
                    <div 
                      className="w-32 h-40 mx-auto mb-4 bg-arcana-accent rounded-lg border border-arcana-subtle flex items-center justify-center cursor-pointer hover:bg-arcana-accent-hover transition-colors"
                      onClick={() => setSelectedCard(getRandomCard())}
                    >
                      <span className="text-arcana-tertiary text-center px-2">
                        {selectedCard ? selectedCard.name : 'Tap to draw'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCard(getRandomCard())}
                      className="bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover"
                    >
                      Draw a Random Card
                    </Button>
                  </div>
                </Card>

                <Button 
                  variant="outline" 
                  onClick={() => setShowAllCards(true)}
                  className="w-full bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover"
                >
                  Browse All 22 Major Arcana
                </Button>

                {selectedCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <TarotCardComponent 
                      card={selectedCard} 
                      isRevealed={true}
                      className="scale-75 origin-top"
                    />
                  </motion.div>
                )}
              </div>
            ) : (
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllCards(false)}
                  className="mb-6 bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover"
                >
                  ← Back to Random Draw
                </Button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {majorArcana.map(card => (
                    <div key={card.id} 
                         className="cursor-pointer"
                         onClick={() => setSelectedCard(card)}>
                                              <Card className="bg-arcana-surface border-arcana-primary p-3 text-center hover:bg-arcana-accent transition-colors">
                        <h4 className="text-white text-sm font-serif mb-2">{card.name}</h4>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {card.keywords.slice(0, 2).map(keyword => (
                            <span key={keyword} className="text-xs bg-arcana-accent-hover text-arcana-secondary px-2 py-1 rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Practice Reading */}
          <div>
            <h2 className="text-2xl font-serif text-white mb-6">
              Try a Practice Reading
            </h2>
            
            <Card className="bg-arcana-surface border-arcana-primary p-6 mb-6">
              <p className="text-arcana-secondary text-sm mb-4 leading-relaxed">
                This is not your real reading—that comes when you begin your year. 
                This is just to feel the rhythm of the cards and the Oracle's voice.
              </p>
              
              <Button 
                onClick={handlePracticeReading}
                className="w-full btn-arcana-primary"
              >
                Draw Three Practice Cards
              </Button>
            </Card>

            {practiceReading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  {practiceReading.map((card, index) => (
                    <TarotCardComponent 
                      key={card.id}
                      card={card} 
                      isRevealed={true}
                      className="scale-50 origin-top"
                      position={['Past', 'Present', 'Potential'][index]}
                    />
                  ))}
                </div>
                
                <Card className="bg-arcana-surface border-arcana-primary p-4">
                  <p className="text-arcana-tertiary text-sm italic text-center">
                    "The Oracle remains silent during the Prologue. 
                    When you begin your year, the readings will come alive."
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Call to Action - Begin Year */}
        <div className="text-center mt-16 space-y-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-serif text-white mb-4">
              Ready to Begin?
            </h3>
            <p className="text-arcana-secondary mb-6 leading-relaxed">
              Your year of reflection awaits. Once you begin, the Oracle will respond to your draws, 
              your journey will unfold day by day, and your path will be uniquely yours.
            </p>
            
            <Link href="/ritual">
              <Button size="lg" className="btn-arcana-primary px-8 py-3 text-lg">
                Begin Your Year
              </Button>
            </Link>
            
            <p className="text-arcana-muted text-xs mt-4">
              This will start your 365-day journey
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
