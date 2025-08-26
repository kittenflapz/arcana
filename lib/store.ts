import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getDayIndex, getWeekNumberFromDayIndex, getDeviceTimezone, hasGrantForToday, type CanonicalDate, isTimezoneMismatch, getTodayCanonicalDate } from './time'
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
  startAt?: string // ISO UTC when the year began
  lastReadingCanonicalDate?: CanonicalDate | null
  lastReadingDayNumber?: number | null
  yearIntention: string
  missedDays: number[]
  completedDays: number[]
  pendingAbsenceNote: boolean
  readingCompletionPending: boolean
  
  // Settings & consent
  showTransparencyBadge: boolean
  consentCurrentEvents: boolean
  consentPersonalizationWeatherTone: boolean
  consentPersonalizationCalendarHints: boolean
  wellbeingContentWarnings: boolean
  enableGroundingPause: boolean
  calendarHintText?: string
  
  // Current session
  todaysReading: Reading | null
  isLoadingReading: boolean
  canReadToday: boolean
  
  // UI state
  currentWeek: number
  timezoneMismatch: boolean
  
  // Actions
  setUser: (user: User | null) => void
  beginYear: (timezone: string, intention?: string) => void
  setReading: (reading: Reading) => void
  updateJournal: (entry: string) => void
  confirmDayComplete: () => void
  updateIntention: (intention: string) => void
  clearSession: () => void
  incrementDay: () => void
  recomputeTime: (nowMs?: number) => void
  acknowledgeAbsenceNote: () => void
  
  // Settings actions
  setShowTransparencyBadge: (value: boolean) => void
  setConsentCurrentEvents: (value: boolean) => void
  setConsentPersonalizationWeatherTone: (value: boolean) => void
  setConsentPersonalizationCalendarHints: (value: boolean) => void
  setWellbeingContentWarnings: (value: boolean) => void
  setEnableGroundingPause: (value: boolean) => void
  setCalendarHintText: (value: string) => void
  revokeAllOptionalConsents: () => void
  
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
      timezone: getDeviceTimezone(),
      startAt: undefined,
      lastReadingCanonicalDate: null,
      lastReadingDayNumber: null,
      yearIntention: '',
      missedDays: [],
      completedDays: [],
      pendingAbsenceNote: false,
      readingCompletionPending: false,
      // Settings defaults (conservative)
      showTransparencyBadge: true,
      consentCurrentEvents: false,
      consentPersonalizationWeatherTone: false,
      consentPersonalizationCalendarHints: false,
      wellbeingContentWarnings: true,
      enableGroundingPause: true,
      calendarHintText: '',
      todaysReading: null,
      isLoadingReading: false,
      canReadToday: true,
      readingCompletionPending: false,
      currentWeek: 1,
      timezoneMismatch: false,
      
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
        startAt: new Date().toISOString(),
        lastReadingCanonicalDate: null,
        lastReadingDayNumber: null,
        missedDays: [],
        completedDays: [],
        pendingAbsenceNote: false,
        yearIntention: intention,
        todaysReading: null,
        currentWeek: 1,
        canReadToday: true
      }),
      
      setReading: (reading) => {
        const state = get()
        const todayCanonical = getTodayCanonicalDate(state.timezone)
        // Dedup helpers
        const completedSet = new Set([...(state.completedDays || [])])
        completedSet.add(reading.dayNumber)
        set({ 
          todaysReading: reading,
          isLoadingReading: false,
          canReadToday: true, // still true until user confirms completion
          readingCompletionPending: true,
          lastReadingCanonicalDate: todayCanonical,
          lastReadingDayNumber: reading.dayNumber,
          completedDays: Array.from(completedSet).sort((a,b) => a - b)
        })
      },
      confirmDayComplete: () => {
        const state = get()
        if (!state.todaysReading) return
        set({
          canReadToday: false,
          readingCompletionPending: false
        })
      },
      
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
      
      recomputeTime: (nowMs) => {
        const state = get()
        if (!state.hasBegun || !state.startAt) return
        const dayIndex = getDayIndex(state.startAt, state.timezone, nowMs)
        const week = getWeekNumberFromDayIndex(dayIndex)
        const canRead = hasGrantForToday(state.lastReadingCanonicalDate ?? null, state.timezone, nowMs)
        const mismatch = isTimezoneMismatch(state.timezone)
        // Missed days since last reading
        let missedDays = state.missedDays || []
        let pendingAbsenceNote = state.pendingAbsenceNote
        if (state.lastReadingDayNumber && dayIndex > (state.lastReadingDayNumber ?? 0)) {
          const gap = dayIndex - (state.lastReadingDayNumber ?? 0)
          if (gap > 1) {
            const missedRange: number[] = []
            for (let d = (state.lastReadingDayNumber ?? 0) + 1; d <= dayIndex - 1; d++) missedRange.push(d)
            const setMissed = new Set([...(missedDays || []), ...missedRange])
            missedDays = Array.from(setMissed).sort((a,b) => a - b)
            pendingAbsenceNote = true
          } else {
            pendingAbsenceNote = false
          }
        }
        set({ currentDay: dayIndex, currentWeek: week, canReadToday: canRead, timezoneMismatch: mismatch, missedDays, pendingAbsenceNote })
      },

      acknowledgeAbsenceNote: () => set({ pendingAbsenceNote: false }),
      
      // Settings actions
      setShowTransparencyBadge: (value) => set({ showTransparencyBadge: value }),
      setConsentCurrentEvents: (value) => set({ consentCurrentEvents: value }),
      setConsentPersonalizationWeatherTone: (value) => set({ consentPersonalizationWeatherTone: value }),
      setConsentPersonalizationCalendarHints: (value) => set({ consentPersonalizationCalendarHints: value }),
      setWellbeingContentWarnings: (value) => set({ wellbeingContentWarnings: value }),
      setEnableGroundingPause: (value) => set({ enableGroundingPause: value }),
      setCalendarHintText: (value) => set({ calendarHintText: value }),
      revokeAllOptionalConsents: () => set({
        consentCurrentEvents: false,
        consentPersonalizationWeatherTone: false,
        consentPersonalizationCalendarHints: false
      }),
      
      clearSession: () => set({
        user: null,
        isAuthenticated: false,
        hasBegun: false,
        currentDay: 0,
        todaysReading: null,
        currentWeek: 1,
        yearIntention: '',
        canReadToday: true,
        readingCompletionPending: false,
        startAt: undefined,
        lastReadingCanonicalDate: null,
        timezoneMismatch: false
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
        canReadToday: state.canReadToday,
        readingCompletionPending: state.readingCompletionPending,
        // Persist settings locally
        showTransparencyBadge: state.showTransparencyBadge,
        consentCurrentEvents: state.consentCurrentEvents,
        consentPersonalizationWeatherTone: state.consentPersonalizationWeatherTone,
        consentPersonalizationCalendarHints: state.consentPersonalizationCalendarHints,
        wellbeingContentWarnings: state.wellbeingContentWarnings,
        enableGroundingPause: state.enableGroundingPause,
        calendarHintText: state.calendarHintText
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
