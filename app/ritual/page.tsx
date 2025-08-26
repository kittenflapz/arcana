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
      // Try to update user profile in database (may fail for demo users)
      if (user.id !== 'demo-user') {
        const { error } = await supabase
          .from('profiles')
          .update({
            has_begun: true,
            start_date: startTomorrow ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            home_timezone: timezone,
            current_day: startTomorrow ? 0 : 1
          })
          .eq('id', user.id)

        if (error) {
          console.log('Database update failed (expected for demo):', error)
          // Continue anyway for demo purposes
        }
      }

      // Update local state
      beginYear(timezone, intention)
      setUser({
        ...user,
        hasBegun: true,
        homeTimezone: timezone,
        currentDay: startTomorrow ? 0 : 1,
        yearIntention: intention
      })

      // Redirect to first reading or waiting page
      if (startTomorrow) {
        router.push('/waiting-for-dawn')
      } else {
        router.push('/daily')
      }
      
    } catch (error) {
      console.error('Error beginning year:', error)
      // For demo purposes, continue anyway
      beginYear(timezone, intention)
      setUser({
        ...user,
        hasBegun: true,
        homeTimezone: timezone,
        currentDay: startTomorrow ? 0 : 1,
        yearIntention: intention
      })
      
      if (startTomorrow) {
        router.push('/waiting-for-dawn')
      } else {
        router.push('/daily')
      }
    } finally {
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
          setBreathCount(prev => {
            const newCount = prev + 1
            if (newCount >= 3) { // After 3 complete cycles
              setIsBreathingExercise(false)
              setCurrentStep(4)
            }
            return newCount
          })
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
