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
    <div className="min-h-screen bg-arcana-gradient flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-serif text-white mb-6">
            Your Year Has Begun
          </h1>
          
          <Card className="bg-arcana-surface border-arcana-primary p-8 mb-8">
            <div className="space-y-6">
              <p className="text-arcana-secondary text-lg">
                The ritual is complete. Your intention is set.
              </p>
              
              <div className="text-4xl font-mono text-arcana-primary">
                {timeUntilMidnight}
              </div>
              
              <p className="text-arcana-tertiary">
                until Day 1 opens in {timezone}
              </p>
              
              <div className="pt-6 border-t border-arcana-primary">
                <p className="text-arcana-muted text-sm leading-relaxed">
                  Rest now. Tomorrow your Oracle awaits with the first reading of your year-long journey. 
                  Each day will bring new cards, deeper wisdom, and the gradual evolution of both 
                  you and your digital guide.
                </p>
              </div>
            </div>
          </Card>
          
          <p className="text-arcana-muted text-xs">
            Bookmark this page • Your reading unlocks automatically at midnight
          </p>
        </motion.div>
      </div>
    </div>
  )
}
