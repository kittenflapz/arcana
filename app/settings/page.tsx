'use client'

import { useArcana } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useMemo } from 'react'

export default function SettingsPage() {
  const {
    // Settings
    showTransparencyBadge,
    consentCurrentEvents,
    consentPersonalizationWeatherTone,
    wellbeingContentWarnings,
    enableGroundingPause,
    timezone,
    // Actions
    setShowTransparencyBadge,
    setConsentCurrentEvents,
    setConsentPersonalizationWeatherTone,
    setWellbeingContentWarnings,
    setEnableGroundingPause,
    revokeAllOptionalConsents,
  } = useArcana()

  const personalizationEnabled = useMemo(
    () => consentPersonalizationWeatherTone,
    [consentPersonalizationWeatherTone]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-serif text-white mb-2">Settings</h1>
          <p className="text-arcana-secondary text-sm">
            Transparency, consent, and wellbeing preferences
          </p>
        </header>

        <div className="space-y-6">
          <Card className="bg-arcana-surface-hover border-arcana-secondary p-6">
            <h2 className="text-xl font-serif text-white mb-4">AI Transparency</h2>
            <div className="flex items-start gap-3">
              <input
                id="show-transparency"
                type="checkbox"
                checked={showTransparencyBadge}
                onChange={(e) => setShowTransparencyBadge(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-arcana-secondary bg-transparent text-white"
              />
              <div>
                <Label htmlFor="show-transparency" className="text-white">Show AI transparency badge</Label>
                <p className="text-arcana-secondary text-sm mt-1">
                  Disclosure remains present across the app; this setting adjusts how prominently it is displayed.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-arcana-surface-hover border-arcana-secondary p-6">
            <h2 className="text-xl font-serif text-white mb-4">Consent</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  id="consent-current-events"
                  type="checkbox"
                  checked={consentCurrentEvents}
                  onChange={(e) => setConsentCurrentEvents(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-arcana-secondary bg-transparent text-white"
                />
                <div>
                  <Label htmlFor="consent-current-events" className="text-white">Blend current events motifs</Label>
                  <p className="text-arcana-secondary text-sm mt-1">
                    Allows subtle tone/motif influenced by public news summaries. Never predictive. You can turn this off anytime.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-arcana-secondary/50 p-4 bg-black/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Personalization (granular)</h3>
                  <span className={`text-xs ${personalizationEnabled ? 'text-green-300' : 'text-arcana-secondary'}`}>
                    {personalizationEnabled ? 'Some sharing enabled' : 'All sharing off'}
                  </span>
                </div>
                <p className="text-arcana-secondary text-xs mt-1">
                  Optional signals to color tone; no PII or content ingestion. You remain in control.
                </p>

                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      id="consent-weather"
                      type="checkbox"
                      checked={consentPersonalizationWeatherTone}
                      onChange={(e) => setConsentPersonalizationWeatherTone(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-arcana-secondary bg-transparent text-white"
                    />
                    <div>
                      <Label htmlFor="consent-weather" className="text-white">City‑level weather tone</Label>
                      <p className="text-arcana-secondary text-sm mt-1">
                        Lets the Oracle mirror local weather as motif. Never stores your exact location.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={revokeAllOptionalConsents}
                    className="bg-black/30 border-arcana-secondary/60 text-arcana-secondary hover:text-white"
                  >
                    Revoke all optional sharing
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-arcana-surface-hover border-arcana-secondary p-6">
            <h2 className="text-xl font-serif text-white mb-4">Wellbeing</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  id="content-warnings"
                  type="checkbox"
                  checked={wellbeingContentWarnings}
                  onChange={(e) => setWellbeingContentWarnings(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-arcana-secondary bg-transparent text-white"
                />
                <div>
                  <Label htmlFor="content-warnings" className="text-white">Content warnings</Label>
                  <p className="text-arcana-secondary text-sm mt-1">
                    Enables gentle content flags and a “skip heavy prompt” option.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="grounding-pause"
                  type="checkbox"
                  checked={enableGroundingPause}
                  onChange={(e) => setEnableGroundingPause(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-arcana-secondary bg-transparent text-white"
                />
                <div>
                  <Label htmlFor="grounding-pause" className="text-white">Enable grounding pause</Label>
                  <p className="text-arcana-secondary text-sm mt-1">
                    Offers a brief breathing prompt before a reading when helpful.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-arcana-surface-hover border-arcana-secondary p-6">
            <h2 className="text-xl font-serif text-white mb-4">Time & Identity</h2>
            <div className="space-y-2 text-arcana-secondary text-sm">
              <p><span className="text-white">Home timezone:</span> {timezone}</p>
              <p>Daily readings unlock at home midnight. Travel does not grant extra readings.</p>
              <p>You can review this anytime; changing your home timezone is not supported in MVP.</p>
            </div>
          </Card>

          <div className="text-center text-arcana-secondary text-xs">
            <p>Preferences save instantly on this device. Sync across devices is a later milestone.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


