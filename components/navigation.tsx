'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useArcana } from '@/lib/store'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

export function Navigation() {
  const pathname = usePathname()
  const { hasBegun, currentDay, isAuthenticated } = useArcana()
  const [user, setUser] = useState<User | null>(null)

  // Debug logging to help track state changes
  useEffect(() => {
    console.log('Navigation state:', { hasBegun, currentDay, isAuthenticated })
  }, [hasBegun, currentDay, isAuthenticated])

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { href: '/', label: 'Home', show: true },
    { href: '/deck', label: 'Deck', show: true },
    { href: '/prologue', label: 'Prologue', show: !hasBegun },
    { href: '/daily', label: `Day ${currentDay}`, show: hasBegun },
    { href: '/timeline', label: 'Journey', show: hasBegun },
    { href: '/settings', label: 'Settings', show: isAuthenticated },
  ]

  // Hide nav during ritual and waiting-for-dawn
  if (pathname === '/ritual' || pathname === '/waiting-for-dawn') {
    return null
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-arcana-surface-hover backdrop-blur-md border-b border-arcana-secondary shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-white">
            Arcana
          </Link>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {navItems
                .filter(item => item.show)
                .map(item => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={pathname === item.href ? "default" : "ghost"}
                      size="sm"
                      className={pathname === item.href ? 
                        "btn-arcana-primary" : 
                        "text-arcana-secondary hover:text-white hover:bg-arcana-accent-hover"
                      }
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
            </div>
            
            {user && (
              <div className="flex items-center gap-3 pl-6 border-l border-arcana-subtle">
                <span className="text-arcana-secondary text-sm">
                  {user.email?.split('@')[0]}
                </span>
                <div className="w-8 h-8 bg-arcana-accent rounded-full flex items-center justify-center border border-arcana-secondary">
                  <span className="text-arcana-secondary text-xs font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
