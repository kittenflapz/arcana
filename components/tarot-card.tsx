'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TarotCard } from '@/lib/tarot'
import { Card } from '@/components/ui/card'

interface TarotCardProps {
  card?: TarotCard
  isRevealed?: boolean
  onClick?: () => void
  className?: string
  position?: string // For spread position (Past, Present, Potential)
}

export function TarotCardComponent({ 
  card, 
  isRevealed = false, 
  onClick,
  className = '',
  position
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(isRevealed)
  const [showDetails, setShowDetails] = useState(false)

  const handleClick = () => {
    if (!isRevealed) {
      setIsFlipped(true)
      setShowDetails(false)
    } else if (isFlipped) {
      setShowDetails(prev => !prev)
    } else {
      setIsFlipped(true)
      setShowDetails(false)
    }
    onClick?.()
  }

  return (
    <div className={`perspective-1000 ${className}`}>
      {position && (
        <h3 className="text-center text-arcana-secondary mb-4 font-serif text-lg">
          {position}
        </h3>
      )}
      
      <motion.div
        className="relative w-60 h-80 mx-auto cursor-pointer"
        onClick={handleClick}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        whileHover={{ scale: isFlipped ? 1 : 1.05 }}
      >
        {/* Card Back */}
        <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 to-blue-900 border-arcana-primary hover:border-arcana-secondary transition-colors">
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✦</span>
              </div>
              <p className="text-arcana-secondary text-sm font-serif">Arcana</p>
              <p className="text-arcana-muted text-xs mt-2">Tap to reveal</p>
            </div>
          </div>
        </Card>

        {/* Card Front (Art-first with toggleable overlay) */}
        <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-arcana-primary overflow-hidden" 
              style={{ transform: 'rotateY(180deg)' }}>
          {/* Art layer */}
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <div className={`text-2xl font-serif tracking-wide text-arcana-secondary ${showDetails ? 'opacity-50' : 'opacity-90'} transition-opacity`}>
              ART HERE
            </div>
          </div>

          {/* Details overlay */}
          {card && (
            <div className={`absolute inset-0 transition-opacity ${showDetails ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative w-full h-full p-4 flex flex-col">
                <div className="mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-white font-serif text-[15px] whitespace-nowrap">{card.name}</h3>
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full flex items-center justify-center border border-arcana-secondary">
                        <span className="text-arcana-tertiary text-xs">
                          {card.arcana === 'major' ? '★' : '◆'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center min-h-[44px] overflow-hidden">
                      {card.keywords.slice(0, 4).map(keyword => (
                        <span key={keyword} className="text-[10px] bg-arcana-accent-hover text-arcana-secondary px-2 py-1 rounded-full whitespace-nowrap max-h-6">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-none space-y-3 pr-1">
                  <p className="text-arcana-secondary text-sm text-center leading-relaxed">
                    {card.meaning}
                  </p>
                  <p className="text-arcana-muted text-xs text-center italic">
                    {card.question}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
