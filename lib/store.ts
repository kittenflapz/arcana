import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TarotCard } from './tarot'

// User interface
interface User {
  id: string
  email: string
  hasBegun: boolean
  startDate?: string
  homeTimezone: string
  currentDay: number
  yearIntention?: string
}

// Reading interface
interface Reading {
  id: string
  dayNumber: number
  cards: TarotCard[]
  oracleResponse: string
  userIntention?: string
  journalEntry?: string
  createdAt: string
}

// Main application state
interface ArcanaState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // Journey state
  hasBegun: boolean
  currentDay: number
  timezone: string
  yearIntention: string
  
  // Current session
  todaysReading: Reading | null
  isLoadingReading: boolean
  canReadToday: boolean
  
  // UI state
  currentWeek: number
  
  // Actions
  setUser: (user: User | null) => void
  beginYear: (timezone: string, intention?: string) => void
  setReading: (reading: Reading) => void
  updateJournal: (entry: string) => void
  updateIntention: (intention: string) => void
  clearSession: () => void
  incrementDay: () => void
  
  // Computed getters
  getWeekNumber: () => number
  getOraclePersona: () => string
}

export const useArcana = create<ArcanaState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      hasBegun: false,
      currentDay: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      yearIntention: '',
      todaysReading: null,
      isLoadingReading: false,
      canReadToday: true,
      currentWeek: 1,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        hasBegun: user?.hasBegun || false,
        currentDay: user?.currentDay || 0,
        timezone: user?.homeTimezone || get().timezone,
        yearIntention: user?.yearIntention || ''
      }),
      
      beginYear: (timezone, intention = '') => set({ 
        hasBegun: true, 
        currentDay: 1, 
        timezone,
        yearIntention: intention,
        todaysReading: null,
        currentWeek: 1,
        canReadToday: true
      }),
      
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
        canReadToday: true
      }),
      
      // Computed getters
      getWeekNumber: () => {
        const day = get().currentDay
        return Math.ceil(day / 7)
      },
      
      getOraclePersona: () => {
        const week = get().getWeekNumber()
        if (week <= 4) return 'confident_mystical'
        if (week <= 17) return 'pattern_recognizing'
        if (week <= 34) return 'questioning_self'
        if (week <= 47) return 'vulnerable_humble'
        return 'compassionate_mirror'
      }
    }),
    {
      name: 'arcana-state',
      partialize: (state) => ({
        hasBegun: state.hasBegun,
        currentDay: state.currentDay,
        timezone: state.timezone,
        currentWeek: state.currentWeek,
        todaysReading: state.todaysReading,
        canReadToday: state.canReadToday
      })
    }
  )
)

// Selector hooks for performance
export const useUser = () => useArcana(state => state.user)
export const useAuth = () => useArcana(state => ({ 
  isAuthenticated: state.isAuthenticated,
  user: state.user 
}))
export const useJourney = () => useArcana(state => ({
  hasBegun: state.hasBegun,
  currentDay: state.currentDay,
  currentWeek: state.currentWeek,
  timezone: state.timezone
}))
export const useReading = () => useArcana(state => ({
  todaysReading: state.todaysReading,
  isLoadingReading: state.isLoadingReading
}))

// Helper functions
export function getPersonaDescription(persona: string): string {
  const descriptions = {
    confident_mystical: 'Confident and mystical, speaking with ancient wisdom',
    pattern_recognizing: 'Thoughtful and observant, beginning to notice patterns',
    questioning_self: 'Increasingly self-aware, admitting uncertainty',
    vulnerable_humble: 'Vulnerable and humble, showing genuine uncertainty', 
    compassionate_mirror: 'Honest and compassionate, embracing role as reflection tool'
  }
  return descriptions[persona as keyof typeof descriptions] || descriptions.confident_mystical
}
