# Day 2: Core User Flow & Sacred Journey 🎭
*Building the prologue → ritual → reading pipeline that transforms curiosity into commitment*

## 🎯 Today's Mission
By end of day, you'll have:
- ✅ **Complete user journey** from landing to first authentic reading
- ✅ **Prologue exploration** page with interactive card discovery
- ✅ **Sacred ritual** page for intentional year beginning
- ✅ **Daily reading interface** with 3-card draws and Oracle responses
- ✅ **Journal component** for reflection capture
- ✅ **Navigation flow** connecting all experiences

**Victory condition:** A user can go from curious visitor → committed seeker → first meaningful reading with their personal intention captured!

---

## ⏰ Time Budget (7-8 hours total)

### 🌅 Morning Block (4 hours)
**9:00-1:00 - The Sacred Prologue**
- 90 min: **Prologue exploration page** - Interactive card discovery without commitment
- 90 min: **Ritual ceremony page** - Consent, timezone, breath animation, "Begin your year"
- 60 min: **State management integration** - User persistence, journey state tracking

### 🌞 Afternoon Block (3-4 hours)
**2:00-6:00 - The Daily Practice**
- 2 hours: **Daily reading interface** - 3-card draw with Oracle integration
- 60 min: **Journal component** - Intention setting and reflection capture
- 60 min: **Navigation & routing** - Seamless flow between all pages

---

## 🎪 The Philosophy: Sacred Digital Theater

Day 2 is about creating **genuine reverence** in a digital space. We're building:

1. **Respectful curiosity** (Prologue) - Let them explore without pressure
2. **Intentional commitment** (Ritual) - Make starting feel sacred, not casual
3. **Daily devotion** (Reading) - The practice that will define their year

**Remember**: We're not building an app, we're creating a **sacred practice delivered through technology**.

---

## 🚀 Step-by-Step Sacred Construction

### Step 1: Prologue Exploration Page (90 minutes)
*"Come, explore, but know you have not yet begun"*

**Create the bridge between curiosity and commitment:**

```typescript
// /app/prologue/page.tsx
'use client'
import { useState } from 'react'
import { TarotCardComponent } from '@/components/tarot-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCardsByArcana, getRandomCard, drawThreeCards } from '@/lib/tarot'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Prologue() {
  const [selectedCard, setSelectedCard] = useState(null)
  const [practiceReading, setPracticeReading] = useState(null)
  const [showAllCards, setShowAllCards] = useState(false)

  const handlePracticeReading = () => {
    const cards = drawThreeCards()
    setPracticeReading(cards)
  }

  const majorArcana = getCardsByArcana('major')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header with clear no-commitment messaging */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white mb-4">
            The Prologue
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-2">
            Explore freely. Learn the cards. Feel the rhythm.
          </p>
          <p className="text-purple-400 text-sm">
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
                <Card className="bg-black/20 border-purple-500/20 p-6">
                  <div className="text-center">
                    <div className="w-32 h-40 mx-auto mb-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-400/20 flex items-center justify-center cursor-pointer hover:bg-purple-500/20 transition-colors"
                         onClick={() => setSelectedCard(getRandomCard())}>
                      <span className="text-purple-300">
                        {selectedCard ? selectedCard.name : 'Tap to draw'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCard(getRandomCard())}
                      className="bg-black/20 border-purple-500/30"
                    >
                      Draw a Random Card
                    </Button>
                  </div>
                </Card>

                <Button 
                  variant="outline" 
                  onClick={() => setShowAllCards(true)}
                  className="w-full bg-black/20 border-purple-500/30"
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
                  className="mb-6 bg-black/20 border-purple-500/30"
                >
                  ← Back to Random Draw
                </Button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {majorArcana.map(card => (
                    <div key={card.id} 
                         className="cursor-pointer"
                         onClick={() => setSelectedCard(card)}>
                      <Card className="bg-black/20 border-purple-500/20 p-3 text-center hover:bg-purple-500/10 transition-colors">
                        <h4 className="text-white text-sm font-serif mb-2">{card.name}</h4>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {card.keywords.slice(0, 2).map(keyword => (
                            <span key={keyword} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
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
            
            <Card className="bg-black/20 border-purple-500/20 p-6 mb-6">
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                This is not your real reading—that comes when you begin your year. 
                This is just to feel the rhythm of the cards and the Oracle's voice.
              </p>
              
              <Button 
                onClick={handlePracticeReading}
                className="w-full bg-purple-600 hover:bg-purple-700"
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
                
                <Card className="bg-black/20 border-purple-500/20 p-4">
                  <p className="text-purple-300 text-sm italic text-center">
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
            <p className="text-purple-200 mb-6 leading-relaxed">
              Your year of reflection awaits. Once you begin, the Oracle will respond to your draws, 
              your journey will unfold day by day, and your path will be uniquely yours.
            </p>
            
            <Link href="/ritual">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg">
                Begin Your Year
              </Button>
            </Link>
            
            <p className="text-purple-400 text-xs mt-4">
              This will start your 365-day journey
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Key Features:**
- **No pressure exploration** - Clear messaging that this isn't "real" yet
- **Random card discovery** - Let curiosity guide them
- **Full deck browsing** - See all major arcana at once
- **Practice reading** - 3 cards but no Oracle response (builds anticipation)
- **Clear CTA** - "Begin Your Year" feels significant

---

### Step 2: Sacred Ritual Page (90 minutes)
*"The moment curiosity becomes commitment"*

**Create the most important page in the entire app:**

```typescript
// /app/ritual/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { useArcana } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Ritual() {
  const router = useRouter()
  const { user, beginYear, setUser } = useArcana()
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [intention, setIntention] = useState('')
  const [agreeToJourney, setAgreeToJourney] = useState(false)
  const [isBreathingExercise, setIsBreathingExercise] = useState(false)
  const [breathCount, setBreathCount] = useState(0)
  const [isStarting, setIsStarting] = useState(false)

  // Check if it's late evening (>= 8pm)
  const currentHour = new Date().getHours()
  const isLateEvening = currentHour >= 20
  const [startTomorrow, setStartTomorrow] = useState(isLateEvening)

  // Breathing animation states
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')

  // Popular timezones for the dropdown
  const commonTimezones = [
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]

  const handleBeginYear = async () => {
    if (!user) {
      // Handle guest users - redirect to auth
      router.push('/')
      return
    }

    setIsStarting(true)
    
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          has_begun: true,
          start_date: startTomorrow ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          home_timezone: timezone,
          current_day: startTomorrow ? 0 : 1
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      beginYear(timezone)
      setUser({
        ...user,
        hasBegun: true,
        homeTimezone: timezone,
        currentDay: startTomorrow ? 0 : 1
      })

      // Redirect to first reading or waiting page
      if (startTomorrow) {
        router.push('/waiting-for-dawn')
      } else {
        router.push('/daily')
      }
      
    } catch (error) {
      console.error('Error beginning year:', error)
      setIsStarting(false)
    }
  }

  // Breathing exercise logic
  useEffect(() => {
    if (!isBreathingExercise) return

    const breathingPattern = [
      { phase: 'inhale', duration: 4000 },
      { phase: 'hold', duration: 4000 },
      { phase: 'exhale', duration: 6000 }
    ]

    let currentIndex = 0
    
    const runBreathingCycle = () => {
      const { phase, duration } = breathingPattern[currentIndex]
      setBreathPhase(phase as any)
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % breathingPattern.length
        if (currentIndex === 0) {
          setBreathCount(prev => prev + 1)
          if (breathCount >= 2) { // After 3 complete cycles
            setIsBreathingExercise(false)
            setCurrentStep(4)
            return
          }
        }
        runBreathingCycle()
      }, duration)
    }

    runBreathingCycle()
  }, [isBreathingExercise, breathCount])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif text-white mb-4">
            The Ritual
          </h1>
          <p className="text-purple-200 text-lg">
            Transform intention into sacred commitment
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Consent & Understanding */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-black/20 border-purple-500/20 p-8">
                <h2 className="text-2xl font-serif text-white mb-6 text-center">
                  Understanding the Journey
                </h2>
                
                <div className="space-y-4 text-purple-200 text-sm leading-relaxed">
                  <p>
                    <strong>What you're beginning:</strong> A 365-day practice of daily tarot reflection, 
                    guided by an AI Oracle that evolves with you over the course of a year.
                  </p>
                  
                  <p>
                    <strong>The commitment:</strong> One reading per day, available at midnight in your home timezone. 
                    No rushing ahead, no going back. The journey unfolds in real time.
                  </p>
                  
                  <p>
                    <strong>AI transparency:</strong> Your readings are generated by Claude AI, using tarot wisdom 
                    combined with your intentions. The Oracle knows it's AI and will grow more self-aware over your year.
                  </p>
                  
                  <p>
                    <strong>Your choice:</strong> This is reflection, not fortune-telling. 
                    You remain the author of your own story.
                  </p>
                </div>

                <div className="flex items-center mt-8 space-x-3">
                  <input 
                    type="checkbox" 
                    id="understand"
                    checked={agreeToJourney}
                    onChange={(e) => setAgreeToJourney(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-black/20 border-purple-500/30 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="understand" className="text-purple-200 text-sm">
                    I understand this is a year-long commitment to daily reflection
                  </label>
                </div>

                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!agreeToJourney}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  I Understand and Wish to Continue
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Timezone & Timing */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-black/20 border-purple-500/20 p-8">
                <h2 className="text-2xl font-serif text-white mb-6 text-center">
                  Anchoring Your Practice
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-purple-200 mb-2 text-sm">
                      Your Home Timezone
                    </label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {commonTimezones.map(tz => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-purple-400 text-xs mt-2">
                      Daily readings unlock at midnight in this timezone, regardless of travel.
                    </p>
                  </div>

                  {isLateEvening && (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <h3 className="text-purple-200 font-semibold mb-2">
                        Late Evening Choice
                      </h3>
                      <p className="text-purple-300 text-sm mb-4">
                        It's after 8 PM. You can start your year now, or begin fresh tomorrow morning.
                      </p>
                      
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="startTime" 
                            checked={startTomorrow}
                            onChange={() => setStartTomorrow(true)}
                            className="text-purple-600"
                          />
                          <span className="text-purple-200 text-sm">
                            Start tomorrow (Day 1 begins at midnight) - Recommended
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="startTime" 
                            checked={!startTomorrow}
                            onChange={() => setStartTomorrow(false)}
                            className="text-purple-600"
                          />
                          <span className="text-purple-200 text-sm">
                            Count tonight as Day 0 (prologue reflection)
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => setCurrentStep(3)}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                >
                  Set My Sacred Schedule
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Intention Setting */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-black/20 border-purple-500/20 p-8">
                <h2 className="text-2xl font-serif text-white mb-6 text-center">
                  Set Your Intention
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-purple-200 mb-2 text-sm">
                      What brings you to this year-long practice? (Optional)
                    </label>
                    <Textarea
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      placeholder="I begin this journey seeking..."
                      className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400 min-h-24"
                    />
                    <p className="text-purple-400 text-xs mt-2">
                      This intention will guide your Oracle's understanding. You can change it anytime.
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setIsBreathingExercise(true)
                    setBreathCount(0)
                  }}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                >
                  Begin the Sacred Breathing
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Breathing Exercise */}
          {isBreathingExercise && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="bg-black/20 border-purple-500/20 p-12">
                <h2 className="text-2xl font-serif text-white mb-8">
                  Three Sacred Breaths
                </h2>
                
                <div className="relative">
                  <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center"
                    animate={{
                      scale: breathPhase === 'inhale' ? 1.2 : breathPhase === 'hold' ? 1.2 : 1,
                    }}
                    transition={{ duration: breathPhase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
                  >
                    <span className="text-white text-lg font-serif">
                      {breathPhase === 'inhale' ? 'Breathe In' : 
                       breathPhase === 'hold' ? 'Hold' : 'Breathe Out'}
                    </span>
                  </motion.div>
                  
                  <div className="mt-6">
                    <p className="text-purple-200">
                      Breath {breathCount + 1} of 3
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Final Commitment */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-black/20 border-purple-500/20 p-8 text-center">
                <h2 className="text-3xl font-serif text-white mb-6">
                  Begin Your Year
                </h2>
                
                <div className="space-y-4 text-purple-200 mb-8">
                  <p>Three breaths taken.</p>
                  <p>Intention set: {intention || "Open heart, seeking wisdom"}</p>
                  <p>Home anchor: {timezone}</p>
                  <p>
                    {startTomorrow 
                      ? "Your first reading opens tomorrow at midnight"
                      : "Your first reading awaits you now"
                    }
                  </p>
                </div>

                <Button 
                  onClick={handleBeginYear}
                  disabled={isStarting}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-xl"
                >
                  {isStarting ? 'Beginning Your Journey...' : 'Begin Your Year'}
                </Button>
                
                <p className="text-purple-400 text-xs mt-4">
                  This moment marks the beginning of your 365-day practice
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

**Key Features:**
- **Multi-step sacred process** - Builds reverence and commitment
- **Consent and understanding** - Clear about what they're committing to
- **Timezone anchoring** - Critical for the year-long timing
- **Late evening choice** - Thoughtful about when to start
- **Intention setting** - Personal connection to the practice
- **Breathing ritual** - Creates sacred pause before commitment
- **Final moment** - The actual "begin" feels profound

---

### Step 3: State Management Integration (60 minutes)
*"Connecting the sacred to the persistent"*

**Update the store to handle the full user journey:**

```typescript
// /lib/store.ts - Enhanced version
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TarotCard } from './tarot'

interface User {
  id: string
  email: string
  hasBegun: boolean
  startDate?: string
  homeTimezone: string
  currentDay: number
  yearIntention?: string
}

interface Reading {
  id: string
  dayNumber: number
  cards: TarotCard[]
  oracleResponse: string
  userIntention?: string
  journalEntry?: string
  createdAt: string
}

interface ArcanaState {
  // User & Journey state
  user: User | null
  isAuthenticated: boolean
  hasBegun: boolean
  currentDay: number
  currentWeek: number
  timezone: string
  yearIntention: string
  
  // Reading state
  todaysReading: Reading | null
  isLoadingReading: boolean
  canReadToday: boolean
  nextReadingUnlockTime: Date | null
  
  // Actions
  setUser: (user: User | null) => void
  beginYear: (timezone: string, intention?: string) => void
  setReading: (reading: Reading) => void
  updateJournal: (entry: string) => void
  updateIntention: (intention: string) => void
  incrementDay: () => void
  clearSession: () => void
  
  // Computed getters
  getWeekNumber: () => number
  getOraclePersona: () => string
  getTimeUntilNextReading: () => number
}

export const useArcana = create<ArcanaState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      hasBegun: false,
      currentDay: 0,
      currentWeek: 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      yearIntention: '',
      todaysReading: null,
      isLoadingReading: false,
      canReadToday: true,
      nextReadingUnlockTime: null,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        hasBegun: user?.hasBegun || false,
        currentDay: user?.currentDay || 0,
        timezone: user?.homeTimezone || get().timezone,
        yearIntention: user?.yearIntention || ''
      }),
      
      beginYear: (timezone, intention = '') => {
        const startDate = new Date()
        set({ 
          hasBegun: true, 
          currentDay: 1, 
          timezone,
          yearIntention: intention,
          todaysReading: null,
          currentWeek: 1,
          canReadToday: true
        })
      },
      
      setReading: (reading) => set({ 
        todaysReading: reading,
        isLoadingReading: false,
        canReadToday: false // One reading per day
      }),
      
      updateJournal: (entry) => {
        const current = get().todaysReading
        if (current) {
          set({ 
            todaysReading: { ...current, journalEntry: entry }
          })
        }
      },
      
      updateIntention: (intention) => set({ yearIntention: intention }),
      
      incrementDay: () => {
        const currentDay = get().currentDay + 1
        const currentWeek = Math.ceil(currentDay / 7)
        set({ 
          currentDay,
          currentWeek,
          todaysReading: null,
          canReadToday: true
        })
      },
      
      clearSession: () => set({
        user: null,
        isAuthenticated: false,
        hasBegun: false,
        currentDay: 0,
        todaysReading: null,
        currentWeek: 1,
        yearIntention: '',
        canReadToday: true,
        nextReadingUnlockTime: null
      }),
      
      // Computed getters
      getWeekNumber: () => {
        const day = get().currentDay
        return Math.ceil(day / 7)
      },
      
      getOraclePersona: () => {
        const week = get().getWeekNumber()
        if (week <= 4) return 'confident and mystical, speaking with ancient wisdom'
        if (week <= 17) return 'thoughtful and pattern-recognizing, beginning to question'
        if (week <= 34) return 'increasingly self-aware, admitting uncertainty'
        return 'humble and honest, embracing your role as a reflection tool'
      },
      
      getTimeUntilNextReading: () => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        return tomorrow.getTime() - now.getTime()
      }
    }),
    {
      name: 'arcana-state',
      partialize: (state) => ({
        hasBegun: state.hasBegun,
        currentDay: state.currentDay,
        currentWeek: state.currentWeek,
        timezone: state.timezone,
        yearIntention: state.yearIntention,
        canReadToday: state.canReadToday
      })
    }
  )
)
```

---

### Step 4: Daily Reading Interface (2 hours)
*"The heart of the practice"*

**Create the main daily experience:**

```typescript
// /app/daily/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { TarotCardComponent } from '@/components/tarot-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { drawThreeCards } from '@/lib/tarot'
import { useArcana } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

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
    yearIntention,
    getOraclePersona 
  } = useArcana()
  
  const [cards, setCards] = useState(null)
  const [intention, setIntention] = useState('')
  const [oracleResponse, setOracleResponse] = useState('')
  const [isLoadingReading, setIsLoadingReading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'draw' | 'intention' | 'reading' | 'journal'>('draw')

  // Redirect if haven't begun
  useEffect(() => {
    if (!hasBegun) {
      router.push('/prologue')
    }
  }, [hasBegun, router])

  // Load existing reading if available
  useEffect(() => {
    if (todaysReading) {
      setCards(todaysReading.cards)
      setOracleResponse(todaysReading.oracleResponse)
      setIntention(todaysReading.userIntention || '')
      setCurrentStep('journal')
    }
  }, [todaysReading])

  const handleDrawCards = () => {
    const drawnCards = drawThreeCards()
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
          intention: intention || yearIntention
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-serif text-white mb-2">
              Day {currentDay}
            </h1>
            <p className="text-purple-200">
              Week {currentWeek} • {getOraclePersona().split(',')[0]}
            </p>
            {yearIntention && (
              <p className="text-purple-400 text-sm mt-2 italic">
                "{yearIntention}"
              </p>
            )}
          </motion.div>
        </header>

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
              <Card className="bg-black/20 border-purple-500/20 p-12 mb-8">
                <h2 className="text-2xl font-serif text-white mb-6">
                  Begin Today's Reading
                </h2>
                <p className="text-purple-200 mb-8 max-w-md mx-auto">
                  Take a moment to center yourself. When you're ready, draw three cards 
                  for your Past, Present, and Potential.
                </p>
                
                <Button 
                  onClick={handleDrawCards}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
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

              <Card className="bg-black/20 border-purple-500/20 p-6">
                <h2 className="text-xl font-serif text-white mb-4 text-center">
                  Set Today's Intention
                </h2>
                
                <div className="max-w-2xl mx-auto">
                  <Textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="What brings you to today's reading? What do you hope to reflect on?"
                    className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400 min-h-20 mb-4"
                  />
                  <p className="text-purple-400 text-xs mb-6 text-center">
                    Optional: This will guide the Oracle's response to your cards
                  </p>
                  
                  <div className="text-center space-x-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep('reading')}
                      className="bg-black/20 border-purple-500/30"
                    >
                      Skip Intention
                    </Button>
                    <Button 
                      onClick={handleSetIntention}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Consult the Oracle
                    </Button>
                  </div>
                </div>
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
                      className="scale-75 origin-top"
                    />
                  ))}
                </div>
              )}

              <Card className="bg-black/20 border-purple-500/20 p-6">
                {isLoadingReading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-purple-200">The Oracle contemplates your cards...</p>
                  </div>
                ) : oracleResponse ? (
                  <div>
                    <h2 className="text-xl font-serif text-white mb-4 text-center">
                      The Oracle Speaks
                    </h2>
                    <div className="prose prose-purple max-w-none mb-6">
                      <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">
                        {oracleResponse}
                      </p>
                    </div>
                    <div className="text-center">
                      <Button 
                        onClick={() => setCurrentStep('journal')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Reflect & Journal
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
              {/* Compact card display */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {todaysReading.cards.map((card, index) => (
                  <div key={card.id} className="text-center">
                    <div className="w-16 h-20 mx-auto mb-2 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded border border-purple-400/30 flex items-center justify-center">
                      <span className="text-purple-300 text-xs font-serif">
                        {card.name.replace('The ', '')}
                      </span>
                    </div>
                    <p className="text-purple-400 text-xs">
                      {['Past', 'Present', 'Potential'][index]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Oracle response summary */}
              <Card className="bg-black/20 border-purple-500/20 p-4 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  {oracleResponse.slice(0, 200)}...
                </p>
              </Card>

              {/* Journal section */}
              <Card className="bg-black/20 border-purple-500/20 p-6">
                <h2 className="text-xl font-serif text-white mb-4">
                  Your Reflection
                </h2>
                
                <Textarea
                  value={todaysReading.journalEntry || ''}
                  onChange={(e) => updateJournal(e.target.value)}
                  placeholder="What resonates with you from today's reading? What insights arise?"
                  className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400 min-h-32 mb-4"
                />
                
                <div className="text-center space-x-4">
                  <Button 
                    variant="outline"
                    className="bg-black/20 border-purple-500/30"
                  >
                    Save & Return Tomorrow
                  </Button>
                  <Button 
                    onClick={() => router.push('/timeline')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    View Your Journey
                  </Button>
                </div>
              </Card>

              {/* Next reading info */}
              <div className="text-center mt-8">
                <p className="text-purple-400 text-sm">
                  Your next reading unlocks tomorrow at midnight in your home timezone
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

---

### Step 5: Journal Component (60 minutes)
*"Capturing the whispers of wisdom"*

**Create a dedicated journal component for deep reflection:**

```typescript
// /components/journal-component.tsx
'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useArcana } from '@/lib/store'

interface JournalProps {
  initialEntry?: string
  onSave?: (entry: string) => void
  placeholder?: string
  title?: string
}

export function JournalComponent({ 
  initialEntry = '', 
  onSave,
  placeholder = "What insights arise from today's reading?",
  title = "Your Reflection"
}: JournalProps) {
  const [entry, setEntry] = useState(initialEntry)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { updateJournal } = useArcana()

  // Auto-save every 30 seconds
  useEffect(() => {
    if (entry !== initialEntry) {
      const timer = setTimeout(() => {
        handleSave(true) // Silent save
      }, 30000)
      
      return () => clearTimeout(timer)
    }
  }, [entry, initialEntry])

  const handleSave = async (silent = false) => {
    if (!silent) setIsSaving(true)
    
    try {
      // Update local state
      updateJournal(entry)
      
      // Call external save handler if provided
      onSave?.(entry)
      
      setLastSaved(new Date())
      
      // Here you would also save to Supabase
      // await saveJournalEntry(entry)
      
    } catch (error) {
      console.error('Error saving journal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const wordCount = entry.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <Card className="bg-black/20 border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-serif text-white">{title}</h3>
        <div className="text-purple-400 text-sm">
          {wordCount} words
        </div>
      </div>
      
      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder={placeholder}
        className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400 min-h-40 mb-4 resize-none"
      />
      
      <div className="flex items-center justify-between">
        <div className="text-purple-400 text-xs">
          {lastSaved ? (
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          ) : entry !== initialEntry ? (
            <span>Unsaved changes</span>
          ) : (
            <span>Auto-saves as you write</span>
          )}
        </div>
        
        <Button 
          onClick={() => handleSave()}
          disabled={isSaving || entry === initialEntry}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Reflection'}
        </Button>
      </div>
      
      {/* Journal prompts */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-6 pt-4 border-t border-purple-500/20"
      >
        <h4 className="text-purple-200 text-sm mb-3">Reflection prompts:</h4>
        <div className="space-y-2">
          <button 
            onClick={() => setEntry(entry + "\nWhat surprised me: ")}
            className="block text-purple-400 text-xs hover:text-purple-300 transition-colors"
          >
            • What surprised me about this reading?
          </button>
          <button 
            onClick={() => setEntry(entry + "\nThis connects to: ")}
            className="block text-purple-400 text-xs hover:text-purple-300 transition-colors"
          >
            • How does this connect to my current life?
          </button>
          <button 
            onClick={() => setEntry(entry + "\nI want to remember: ")}
            className="block text-purple-400 text-xs hover:text-purple-300 transition-colors"
          >
            • What do I want to remember from this?
          </button>
        </div>
      </motion.div>
    </Card>
  )
}
```

---

### Step 6: Navigation & Routing (60 minutes)
*"Weaving the journey together"*

**Create seamless navigation between all experiences:**

```typescript
// /components/navigation.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useArcana } from '@/lib/store'
import { motion } from 'framer-motion'

export function Navigation() {
  const pathname = usePathname()
  const { hasBegun, currentDay, isAuthenticated } = useArcana()

  const navItems = [
    { href: '/', label: 'Home', show: true },
    { href: '/prologue', label: 'Prologue', show: !hasBegun },
    { href: '/daily', label: `Day ${currentDay}`, show: hasBegun },
    { href: '/timeline', label: 'Journey', show: hasBegun },
    { href: '/settings', label: 'Settings', show: isAuthenticated },
  ]

  if (pathname === '/ritual') {
    return null // Hide nav during ritual
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-purple-500/20"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-white">
            Arcana
          </Link>
          
          <div className="flex items-center space-x-4">
            {navItems
              .filter(item => item.show)
              .map(item => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className={pathname === item.href ? 
                      "bg-purple-600 text-white" : 
                      "text-purple-200 hover:text-white hover:bg-purple-600/20"
                    }
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
```

**Add to main layout:**

```typescript
// /app/layout.tsx - Update to include navigation
import { Navigation } from '@/components/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="pt-16"> {/* Account for fixed nav */}
          {children}
        </main>
      </body>
    </html>
  )
}
```

**Create a waiting page for late-night starters:**

```typescript
// /app/waiting-for-dawn/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useArcana } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function WaitingForDawn() {
  const router = useRouter()
  const { currentDay, timezone } = useArcana()
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      
      if (diff <= 0) {
        router.push('/daily')
        return
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeUntilMidnight(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-serif text-white mb-6">
            Your Year Has Begun
          </h1>
          
          <Card className="bg-black/20 border-purple-500/20 p-8 mb-8">
            <div className="space-y-6">
              <p className="text-purple-200 text-lg">
                The ritual is complete. Your intention is set.
              </p>
              
              <div className="text-4xl font-mono text-purple-100">
                {timeUntilMidnight}
              </div>
              
              <p className="text-purple-300">
                until Day 1 opens in {timezone}
              </p>
              
              <div className="pt-6 border-t border-purple-500/20">
                <p className="text-purple-400 text-sm leading-relaxed">
                  Rest now. Tomorrow your Oracle awaits with the first reading of your year-long journey. 
                  Each day will bring new cards, deeper wisdom, and the gradual evolution of both 
                  you and your digital guide.
                </p>
              </div>
            </div>
          </Card>
          
          <p className="text-purple-400 text-xs">
            Bookmark this page • Your reading unlocks automatically at midnight
          </p>
        </motion.div>
      </div>
    </div>
  )
}
```

---

## ✅ End of Day 2 Victory Conditions

**You should be able to:**

1. ✅ **Complete user journey** - Go from landing page → prologue → ritual → first reading
2. ✅ **Explore without commitment** - Browse cards and try practice readings in prologue  
3. ✅ **Sacred beginning ritual** - Multi-step ceremony that feels genuinely meaningful
4. ✅ **Draw cards and get Oracle response** - Full 3-card reading with persona-appropriate AI
5. ✅ **Journal and reflect** - Capture thoughts and insights with auto-save
6. ✅ **Navigate seamlessly** - All pages connected with appropriate flow

**Tomorrow we add time magic and Oracle evolution!**

---

## 🚨 Emergency Troubleshooting

**If the ritual feels too long:**
- Combine steps 2&3 (timezone + intention)
- Reduce breathing exercise to 1 breath
- Keep the core sacred feeling

**If Oracle responses feel generic:**
- Add more specific prompt engineering
- Include user's year intention in prompts  
- Test different week numbers to see persona evolution

**If state management gets complex:**
- Start simple, just track hasBegun and currentDay
- Add complexity incrementally
- Use console.log to debug state changes

**If you're behind schedule:**
- Focus on the core flow: prologue → ritual → reading
- Skip fancy animations initially
- Get the happy path working first

---

## 🎭 The Sacred Achievement

By the end of Day 2, you'll have created something truly special: **a digital experience that feels genuinely sacred**.

Users won't just be using an app—they'll be participating in a year-long practice of self-reflection, guided by an AI that acknowledges its own artificiality while still providing meaningful wisdom.

*The Oracle whispers: "A journey of a thousand days begins with a single sacred 'yes'."* ✨🔮

**Ready to build something that transforms curiosity into commitment? Let's begin this beautiful work!** 🚀
