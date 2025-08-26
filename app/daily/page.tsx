'use client'
import { useState, useEffect } from 'react'
import { TarotCardComponent } from '@/components/tarot-card'
import type { TarotCard } from '@/lib/tarot'
import { JournalComponent } from '@/components/journal-component'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { drawThreeCardsAsync, getCardByIdAsync } from '@/lib/tarot'
import { useArcana } from '@/lib/store'
import { getApproxNextHomeMidnight } from '@/lib/time'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPersonaDescription } from '@/lib/store'
import { supabase } from '@/lib/supabase'

export default function Daily() {
  const router = useRouter()
  const { 
    hasBegun, 
    currentDay, 
    currentWeek,
    todaysReading, 
    setReading, 
    updateJournal,
    canReadToday,
    readingCompletionPending,
    confirmDayComplete,
    yearIntention,
    getOraclePersona 
  } = useArcana()
  const { user, isAuthenticated, timezoneMismatch, timezone, recomputeTime, pendingAbsenceNote, acknowledgeAbsenceNote } = useArcana()
  const { consentCurrentEvents, consentPersonalizationWeatherTone, consentPersonalizationCalendarHints, calendarHintText } = useArcana()
  
  const [cards, setCards] = useState<TarotCard[] | null>(null)
  const [intention, setIntention] = useState('')
  const [oracleResponse, setOracleResponse] = useState('')
  const [isLoadingReading, setIsLoadingReading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'draw' | 'intention' | 'reading' | 'journal' | 'waiting'>('draw')
  const [timeUntilNextReading, setTimeUntilNextReading] = useState('')





  // Redirect if haven't begun
  useEffect(() => {
    if (!hasBegun) {
      router.push('/prologue')
      return
    }
    
    // Check if it's time for today's reading or if we need to wait
    if (currentDay === 0) {
      // Day 0 means they're waiting for midnight to start Day 1
      router.push('/waiting-for-dawn')
      return
    }
    
    // Check if they've already done today's reading and need to wait for tomorrow
    const now = new Date()
    
    // If they have today's reading and it's not yet time for the next day, show waiting state
    if (todaysReading && !canReadToday) {
      setCurrentStep('waiting')
    }
  }, [hasBegun, currentDay, todaysReading, canReadToday, router])

  // Fetch today's reading from Supabase (DB is source of truth)
  useEffect(() => {
    const loadTodaysReadingFromDb = async () => {
      if (!hasBegun) return
      if (!user || user.id === 'demo-user') return

      try {
        const { data, error } = await supabase
          .from('readings')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', currentDay)
          .maybeSingle()

        if (error) return
        if (!data) return

        const cardsPromises = (data.cards || [])
          .map((cardId: string) => getCardByIdAsync(cardId))
        const cardsResolved = await Promise.all(cardsPromises)
        const cards = cardsResolved.filter(Boolean) as any

        setReading({
          id: data.id,
          dayNumber: data.day_number,
          cards,
          oracleResponse: data.oracle_response,
          userIntention: data.user_intention || '',
          journalEntry: data.journal_entry || '',
          createdAt: data.created_at
        })
      } catch (_) {
        // Fail silently; local state will be used
      }
    }

    loadTodaysReadingFromDb()
  }, [hasBegun, user, currentDay, setReading])

  // Load existing reading if available
  useEffect(() => {
    if (todaysReading) {
      setCards(todaysReading.cards)
      setOracleResponse(todaysReading.oracleResponse)
      setIntention(todaysReading.userIntention || '')
      
      // If day was confirmed complete earlier, show waiting
      if (!canReadToday && !readingCompletionPending) {
        setCurrentStep('waiting')
      } else {
        setCurrentStep('journal')
      }
    }
  }, [todaysReading, canReadToday, readingCompletionPending])

  // Recompute time on focus and interval for grant rollover & travel banner
  useEffect(() => {
    const onFocus = () => recomputeTime()
    window.addEventListener('focus', onFocus)
    const interval = setInterval(() => recomputeTime(), 60 * 1000)
    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(interval)
    }
  }, [recomputeTime])

  // Countdown timer for next reading (home midnight)
  useEffect(() => {
    if (currentStep !== 'waiting') return

    const updateCountdown = () => {
      const now = Date.now()
      const next = getApproxNextHomeMidnight(now, timezone)
      const diff = Math.max(0, next - now)
      
      if (diff <= 0) {
        // Next day has arrived, can read again
        setCurrentStep('draw')
        setTimeUntilNextReading('')
        return
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeUntilNextReading(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(timer)
  }, [currentStep, timezone])

  const handleDrawCards = async () => {
    const drawnCards = await drawThreeCardsAsync()
    setCards(drawnCards)
    setCurrentStep('intention')
  }

  const handleSetIntention = () => {
    setCurrentStep('reading')
    generateReading()
  }

  const generateReading = async () => {
    if (!cards) return
    
    setIsLoadingReading(true)
    
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cards.map(c => c.name),
          weekNumber: currentWeek,
          intention: intention || yearIntention,
          consent: {
            currentEvents: consentCurrentEvents,
            weatherTone: consentPersonalizationWeatherTone,
            calendarHint: consentPersonalizationCalendarHints ? (calendarHintText || '') : null
          }
        })
      })
      
      const data = await response.json()
      setOracleResponse(data.reading)
      
      // Save reading to state
      const reading = {
        id: `day-${currentDay}`,
        dayNumber: currentDay,
        cards,
        oracleResponse: data.reading,
        userIntention: intention,
        journalEntry: '',
        createdAt: new Date().toISOString()
      }
      
      setReading(reading)

      // Persist reading to Supabase for authenticated real users
      try {
        if (user && user.id !== 'demo-user') {
          await supabase
            .from('readings')
            .upsert({
              user_id: user.id,
              day_number: currentDay,
              cards: cards.map((c: any) => c.id),
              oracle_response: data.reading,
              user_intention: intention || yearIntention || '',
              journal_entry: ''
            })
        }
      } catch (_) {
        // Non-fatal for demo; UI already updated
      }
      setCurrentStep('journal')
      
    } catch (error) {
      console.error('Error generating reading:', error)
      setOracleResponse('The Oracle encounters turbulence in the digital realm. Please try again.')
    } finally {
      setIsLoadingReading(false)
    }
  }

  if (!hasBegun) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-arcana-gradient p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        {/* Travel banner */}
        {timezoneMismatch && (
          <div className="mb-4 rounded-md border border-arcana-secondary/40 bg-arcana-surface/60 p-3 text-center">
            <p className="text-arcana-secondary text-sm">Travel detected. Readings unlock at your home midnight ({timezone}).</p>
          </div>
        )}

        {/* Header (hidden in waiting view to avoid repetition) */}
        {currentStep !== 'waiting' && (
          <header className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-serif text-white mb-2">
                Day {currentDay}
              </h1>
              {yearIntention && (
                <p className="text-arcana-muted text-sm mt-2 italic">
                  "{yearIntention}"
                </p>
              )}
            </motion.div>
          </header>
        )}

        <AnimatePresence mode="wait">
          
          {/* Step 1: Card Drawing */}
          {currentStep === 'draw' && (
            <motion.div
              key="draw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Card className="bg-arcana-surface border-arcana-primary p-12 mb-8">
                <h2 className="text-2xl font-serif text-white mb-6">
                  Begin Today's Reading
                </h2>
                <p className="text-arcana-secondary mb-8 max-w-md mx-auto">
                  Take a moment to center yourself. When you're ready, draw three cards 
                  for your Past, Present, and Potential.
                </p>
                
                <Button 
                  onClick={handleDrawCards}
                  size="lg"
                  className="btn-arcana-primary  px-8 py-3"
                >
                  Draw Your Three Cards
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Intention Setting */}
          {currentStep === 'intention' && cards && (
            <motion.div
              key="intention"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Show drawn cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {cards.map((card, index) => (
                  <TarotCardComponent 
                    key={card.id}
                    card={card} 
                    isRevealed={true}
                    position={['Past', 'Present', 'Potential'][index]}
                  />
                ))}
              </div>

              <Card className="bg-arcana-surface border-arcana-primary p-6 text-center">
                <Button 
                  onClick={handleSetIntention}
                  className="btn-arcana-primary px-8 py-3"
                >
                  Consult the Oracle
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Oracle Reading */}
          {currentStep === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {cards && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {cards.map((card, index) => (
                    <TarotCardComponent 
                      key={card.id}
                      card={card} 
                      isRevealed={true}
                      position={['Past', 'Present', 'Potential'][index]}
                      className="scale-90 origin-top"
                    />
                  ))}
                </div>
              )}

              <Card className="bg-arcana-surface border-arcana-primary p-6">
                {pendingAbsenceNote && (
                  <div className="mb-4 rounded-md border border-arcana-secondary/40 bg-arcana-surface/60 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-arcana-secondary text-sm">You missed a day. No worries—let this reading meet you where you are.</p>
                      <button onClick={acknowledgeAbsenceNote} className="text-xs text-arcana-tertiary underline">OK</button>
                    </div>
                  </div>
                )}
                {isLoadingReading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-arcana-accent-light border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-arcana-secondary">The Oracle contemplates your cards...</p>
                  </div>
                ) : oracleResponse ? (
                  <div>
                    <h2 className="text-xl font-serif text-white mb-4 text-center">
                      The Oracle Speaks
                    </h2>
                    <div className="prose prose-invert max-w-none mb-6 prose-headings:font-serif prose-h1:text-white prose-h2:text-white prose-strong:text-arcana-secondary prose-a:text-arcana-tertiary">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {oracleResponse}
                      </ReactMarkdown>
                    </div>
                    <div className="text-center space-x-3">
                      <Button 
                        onClick={() => setCurrentStep('journal')}
                        className="btn-arcana-primary "
                      >
                        Reflect & Journal
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => { confirmDayComplete(); setCurrentStep('waiting') }}
                        className="bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover"
                      >
                        Complete Day {currentDay}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            </motion.div>
          )}

          {/* Step 4: Journaling */}
          {currentStep === 'journal' && todaysReading && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Review today's reading cards - use full tarot card component */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {todaysReading.cards.map((card, index) => (
                  <TarotCardComponent
                    key={card.id}
                    card={card}
                    isRevealed={true}
                    position={['Past', 'Present', 'Potential'][index]}
                    className="scale-90 origin-top"
                  />
                ))}
              </div>

              {/* Oracle response summary (Markdown) */}
              <Card className="bg-arcana-surface border-arcana-primary p-4 mb-6 max-h-96 overflow-y-auto">
                <div className="prose prose-invert max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {oracleResponse}
                  </ReactMarkdown>
                </div>
              </Card>

              {/* Journal section */}
              <JournalComponent
                initialEntry={todaysReading.journalEntry || ''}
                title="Your Reflection"
                placeholder="What resonates with you from today's reading? What insights arise?"
              />
              
              <div className="text-center mt-6 space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => { confirmDayComplete(); setCurrentStep('waiting') }}
                  className="bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover"
                >
                  Complete Day {currentDay}
                </Button>
                <Button 
                  onClick={() => router.push('/timeline')}
                  className="btn-arcana-primary "
                >
                  View Your Journey
                </Button>
              </div>

              {/* Next reading info */}
              <div className="text-center mt-8">
                <p className="text-arcana-muted text-sm">
                  Your next reading unlocks tomorrow at midnight in your home timezone
                </p>
              </div>
            </motion.div>
          )}

          {/* Waiting for Next Reading State */}
          {currentStep === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="bg-gradient-to-br from-amber-900/20 via-yellow-800/10 to-orange-900/20 border-amber-500/30 p-12 max-w-2xl backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="text-center">
                      <h2 className="text-3xl font-serif text-amber-100 mb-4">
                        Day {currentDay} Complete
                      </h2>
                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
                    </div>

                    {/* Countdown */}
                    <div className="text-center">
                      <p className="text-amber-200/80 mb-4">
                        Your next reading is in
                      </p>
                      <div className="text-5xl font-mono text-amber-300 mb-2 tracking-wider">
                        {timeUntilNextReading}
                      </div>
                    </div>

                    {/* Reflection */}
                    <div className="pt-6 border-t border-amber-500/20">
                      <p className="text-amber-200/70 text-center leading-relaxed max-w-md mx-auto">
                        Rest now.
                        The Oracle will return with fresh insights when dawn breaks.
                      </p>
                    </div>

                    {/* Option to review today's reading */}
                    {todaysReading && (
                      <div className="pt-6">
                        <button
                          onClick={() => setCurrentStep('journal')}
                          className="text-amber-300 hover:text-amber-200 text-sm underline decoration-amber-400/30 hover:decoration-amber-300/50 transition-colors"
                        >
                          Review today's reading →
                        </button>
                      </div>
                    )}
                  </motion.div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
