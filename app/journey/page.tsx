'use client'
import { useMemo } from 'react'
import { useArcana } from '@/lib/store'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

function ArcTicks({
  radius,
  count,
  cx,
  cy,
  startAngle = -Math.PI / 2,
}: { radius: number; count: number; cx: number; cy: number; startAngle?: number }) {
  const ticks = [] as JSX.Element[]
  for (let i = 0; i < count; i++) {
    const a = startAngle + (i / count) * Math.PI * 2
    const p1 = polarToCartesian(cx, cy, radius - 6, a)
    const p2 = polarToCartesian(cx, cy, radius, a)
    ticks.push(
      <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
    )
  }
  return <g>{ticks}</g>
}

export default function JourneyPage() {
  const { currentDay, currentWeek, missedDays, completedDays } = useArcana()

  const days = 365
  const size = 360
  const cx = size / 2
  const cy = size / 2
  const outer = 150
  const inner = 130

  const dayDots = useMemo(() => {
    const dots: Array<{ x: number; y: number; d: number; status: 'past' | 'missed' | 'today' | 'future' }> = []
    for (let d = 1; d <= days; d++) {
      const angle = -Math.PI / 2 + ((d - 1) / days) * Math.PI * 2
      const r = inner + ((d - 1) % 7 === 0 ? 12 : 8)
      const { x, y } = polarToCartesian(cx, cy, r, angle)
      let status: 'past' | 'missed' | 'today' | 'future' = 'future'
      if (d < currentDay) status = (missedDays?.includes(d) ? 'missed' : (completedDays?.includes(d) ? 'past' : 'past'))
      if (d === currentDay) status = 'today'
      dots.push({ x, y, d, status })
    }
    return dots
  }, [currentDay, missedDays, completedDays])

  return (
    <div className="min-h-screen bg-arcana-gradient p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif text-white mb-6">Your Year Journey</h1>

        <Card className="bg-arcana-surface border-arcana-secondary p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-white">
              <defs>
                <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </radialGradient>
              </defs>

              <circle cx={cx} cy={cy} r={outer} fill="none" stroke="url(#ringGrad)" strokeWidth={2} />
              <circle cx={cx} cy={cy} r={inner} fill="none" stroke="url(#ringGrad)" strokeWidth={2} />

              <ArcTicks radius={outer} count={52} cx={cx} cy={cy} />

              {dayDots.map(({ x, y, d, status }) => (
                <circle
                  key={d}
                  cx={x}
                  cy={y}
                  r={status === 'today' ? 3 : 2}
                  fill={
                    status === 'today'
                      ? '#f1c76b' // gold
                      : status === 'missed'
                      ? 'rgba(244,63,94,0.9)' // red
                      : status === 'past'
                      ? '#22c55e' // green (emerald-500)
                      : 'rgba(255,255,255,0.6)' // future
                  }
                  opacity={status === 'future' ? 0.25 : 1}
                />
              ))}

              {/* Today marker */}
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="fill-white" style={{ fontSize: 18 }}>
                Day {currentDay}
              </text>
              <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="central" className="fill-arcana-secondary" style={{ fontSize: 12 }}>
                Week {currentWeek}
              </text>
            </svg>

            <div className="flex-1 w-full">
              <h2 className="text-xl text-white mb-3 font-serif">Overview</h2>
              <p className="text-arcana-secondary mb-4">
                A gentle ring shows your progress through the year. Missed days are noted quietly and do not block your journey.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#f1c76b' }} />
                  <span className="text-arcana-secondary">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                  <span className="text-arcana-secondary">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'rgba(244,63,94,0.9)' }} />
                  <span className="text-arcana-secondary">Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
                  <span className="text-arcana-secondary">Future</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href="/daily" className="text-sm underline text-arcana-tertiary">Return to Today</Link>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-arcana-surface border-arcana-secondary p-6">
          <h2 className="text-xl text-white mb-3 font-serif">Missed Days</h2>
          {(!missedDays || missedDays.length === 0) ? (
            <p className="text-arcana-secondary">No missed days noted. Keep a gentle pace.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missedDays.map(d => (
                <span key={d} className="text-xs px-2 py-1 rounded border border-arcana-secondary/40 text-arcana-secondary">Day {d}</span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}


