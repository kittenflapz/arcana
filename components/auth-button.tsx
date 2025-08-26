'use client'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useArcana } from '@/lib/store'
import type { User } from '@supabase/supabase-js'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { setUser: setStoreUser } = useArcana()

  // Helper function to sync user journey state from database
  const syncUserJourneyState = async (authUser: User) => {
    try {
      // For demo user, use local state
      if (authUser.id === 'demo-user') {
        const currentState = useArcana.getState()
        setStoreUser({
          id: authUser.id,
          email: authUser.email || '',
          hasBegun: currentState.hasBegun,
          homeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          currentDay: currentState.currentDay,
          yearIntention: currentState.yearIntention
        })
        return
      }

      // For real users, fetch from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.log('No profile found, creating one:', error)
        // Create new profile for first-time users
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            has_begun: false,
            home_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            current_day: 0
          })

        if (insertError) {
          console.error('Failed to create profile:', insertError)
        }

        // Set default state for new users
        setStoreUser({
          id: authUser.id,
          email: authUser.email || '',
          hasBegun: false,
          homeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          currentDay: 0,
          yearIntention: ''
        })
      } else {
        // Compute current day from calendar days since start_date in user's timezone
        const tz = profile.home_timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        const toTzDateString = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)

        let computedDay = profile.current_day || 1
        if (profile.has_begun && profile.start_date) {
          const todayStr = toTzDateString(new Date()) // YYYY-MM-DD in tz
          const [ty, tm, td] = todayStr.split('-').map(Number)
          const [sy, sm, sd] = String(profile.start_date).split('-').map(Number)
          const msPerDay = 24 * 60 * 60 * 1000
          const todayUTC = Date.UTC(ty, (tm || 1) - 1, td || 1)
          const startUTC = Date.UTC(sy || ty, (sm || tm) - 1, sd || td)
          const diffDays = Math.max(0, Math.floor((todayUTC - startUTC) / msPerDay))
          computedDay = Math.max(1, diffDays + 1)
        }

        // Also consider readings table as authoritative progression (max day + 1)
        try {
          const { data: lastReading } = await supabase
            .from('readings')
            .select('day_number')
            .eq('user_id', authUser.id)
            .order('day_number', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (lastReading?.day_number) {
            computedDay = Math.max(computedDay, Number(lastReading.day_number) + 1)
          }
        } catch (_) {
          // ignore
        }

        // Persist the computed current day back to the profile if it differs
        try {
          if ((profile.current_day || 0) !== computedDay) {
            await supabase
              .from('profiles')
              .update({ current_day: computedDay })
              .eq('id', authUser.id)
          }
        } catch (_) {
          // Non-fatal; UI remains correct even if write fails
        }

        // Update store with database state (favor computed day)
        setStoreUser({
          id: authUser.id,
          email: authUser.email || '',
          hasBegun: profile.has_begun,
          homeTimezone: profile.home_timezone,
          currentDay: computedDay,
          yearIntention: profile.year_intention || ''
        })
      }
    } catch (err) {
      console.error('Error syncing user state:', err)
      // Fallback to local state
      const currentState = useArcana.getState()
      setStoreUser({
        id: authUser.id,
        email: authUser.email || '',
        hasBegun: currentState.hasBegun,
        homeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currentDay: currentState.currentDay,
        yearIntention: currentState.yearIntention
      })
    }
  }

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        await syncUserJourneyState(user)
      }
      setLoading(false)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user ?? null
      setUser(authUser)
      setLoading(false)
      
      // Sync with store - fetch user's actual journey progress from database
      if (authUser) {
        await syncUserJourneyState(authUser)
      } else {
        setStoreUser(null)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Auth error:', error)
        // For development, create a mock user session
        const demoUser = {
          id: 'demo-user',
          email: 'demo@arcana.app',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated'
        } as User
        setUser(demoUser)
        await syncUserJourneyState(demoUser)
      }
    } catch (err) {
      console.error('Sign in failed:', err)
      // For development, create a mock user session
      const demoUser = {
        id: 'demo-user',
        email: 'demo@arcana.app',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated'
      } as User
      setUser(demoUser)
      await syncUserJourneyState(demoUser)
    } finally {
      setLoading(false)
    }
  }
  
  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null) // Ensure local state is cleared
    setStoreUser(null) // Clear store state
    setLoading(false)
  }

  if (loading) {
    return <Button disabled>Loading...</Button>
  }

  return user ? (
    <Button onClick={signOut} variant="outline" size="lg">
      Sign Out
    </Button>
  ) : (
    <Button onClick={signIn} size="lg" className="flex items-center gap-2 bg-black/80 hover:bg-black text-white">
      <svg aria-hidden="true" className="size-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.932 32.329 29.396 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.508 6.053 28.973 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10 0 19-7.5 19-20 0-1.341-.144-2.333-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.627 15.261 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.508 6.053 28.973 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.313 0 10.185-1.998 13.857-5.262l-6.402-5.408C29.386 34.465 26.861 35.5 24 35.5c-5.371 0-9.895-3.641-11.5-8.573l-6.57 5.053C9.236 38.877 16.011 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.03 3.194-3.49 5.605-6.846 6.825l6.402 5.408C37.882 37.904 40 31.5 40 24c0-1.341-.144-2.333-.389-3.917z"/>
      </svg>
      Begin Your Journey
    </Button>
  )
}
