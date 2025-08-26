'use client'
import { AuthButton } from '@/components/auth-button'
import { Button } from '@/components/ui/button'
import { useArcana } from '@/lib/store'
import Link from 'next/link'

export default function Home() {
  const { hasBegun, isAuthenticated } = useArcana()

  return (
    <main className="min-h-screen bg-arcana-gradient">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-serif text-white mb-4 tracking-wide">
            Arcana
          </h1>
          <p className="text-xl text-arcana-secondary max-w-2xl mx-auto leading-relaxed">
            A year of reflective tarot, guided by an AI Oracle that grows with you
          </p>
        </header>

        {/* Actions Section */}
        <section className="max-w-2xl mx-auto mb-16">
          <div className="text-center space-y-8">
            {/* Conditional Practice Reading - only show if journey hasn't begun */}
            {isAuthenticated && !hasBegun && (
              <div className="space-y-4">
                <Link href="/test-oracle">
                  <Button variant="outline" size="lg" className="bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover">
                    Try a Practice Reading
                  </Button>
                </Link>
                
                <Link href="/prologue">
                  <Button size="lg" className="btn-arcana-primary flex items-center gap-2">
                    {/* Google "G" mark */}
                    <svg aria-hidden="true" className="size-4" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.932 32.329 29.396 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.508 6.053 28.973 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10 0 19-7.5 19-20 0-1.341-.144-2.333-.389-3.917z"/>
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.627 15.261 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.508 6.053 28.973 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 44c5.313 0 10.185-1.998 13.857-5.262l-6.402-5.408C29.386 34.465 26.861 35.5 24 35.5c-5.371 0-9.895-3.641-11.5-8.573l-6.57 5.053C9.236 38.877 16.011 44 24 44z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.03 3.194-3.49 5.605-6.846 6.825l6.402 5.408C37.882 37.904 40 31.5 40 24c0-1.341-.144-2.333-.389-3.917z"/>
                    </svg>
                    Begin Your Journey
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Practice Reading for unauthenticated users */}
            {!isAuthenticated && (
              <Link href="/test-oracle">
                <Button variant="outline" size="lg" className="bg-arcana-surface border-arcana-secondary text-arcana-secondary hover:bg-arcana-accent-hover">
                  Try a Practice Reading
                </Button>
              </Link>
            )}
            
            {/* Daily Reading Access - show if journey has begun */}
            {hasBegun && (
              <div className="p-6 bg-arcana-surface border border-arcana-primary rounded-lg">
                <h3 className="text-xl text-white font-serif mb-4">Your Journey Awaits</h3>
                <Link href="/daily">
                  <Button size="lg" className="btn-arcana-primary">
                    Today's Reading
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* AI Transparency */}
        <section className="text-center">
          <p className="text-blue-400 text-xs">
            This is not fortune-telling. This is AI-assisted self-reflection.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-arcana-subtle">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* GitHub Link */}
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/kittenflapz/arcana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-arcana-secondary hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>

            {/* Auth Button */}
            <AuthButton />
          </div>
        </footer>
      </div>
    </main>
  )
}