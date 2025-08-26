// Time utilities for home-timezone anchoring, canonical dates, and daily grants

const MS_PER_DAY = 24 * 60 * 60 * 1000

export type CanonicalDate = `${number}-${number}-${number}`

export function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function isTimezoneMismatch(homeTimezone: string): boolean {
  try {
    return homeTimezone && getDeviceTimezone() && homeTimezone !== getDeviceTimezone()
  } catch {
    return false
  }
}

function getZonedParts(epochMs: number, timeZone: string): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = dtf.formatToParts(new Date(epochMs))
  const asMap = Object.fromEntries(parts.map(p => [p.type, p.value])) as Record<string, string>
  return {
    year: Number(asMap.year),
    month: Number(asMap.month),
    day: Number(asMap.day),
    hour: Number(asMap.hour),
    minute: Number(asMap.minute),
    second: Number(asMap.second),
  }
}

export function getCanonicalDateForEpoch(epochMs: number, timeZone: string): CanonicalDate {
  const { year, month, day } = getZonedParts(epochMs, timeZone)
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}` as CanonicalDate
}

export function getTodayCanonicalDate(timeZone: string, nowMs: number = Date.now()): CanonicalDate {
  return getCanonicalDateForEpoch(nowMs, timeZone)
}

// Civil date arithmetic (proleptic Gregorian) — converts Y-M-D to days since 1970-01-01
// Adapted from Howard Hinnant's "days_from_civil" algorithm
function civilToEpochDays(year: number, month: number, day: number): number {
  let y = year
  let m = month
  y -= m <= 2 ? 1 : 0
  const era = Math.floor(y / 400)
  const yoe = y - era * 400
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + day - 1
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy
  // Days since 0000-03-01; adjust to 1970-01-01
  const daysSince0000_03_01 = era * 146097 + doe
  const daysTo1970_01_01 = civilToEpochDays_1970_01_01()
  return daysSince0000_03_01 - daysTo1970_01_01
}

// Precompute days for 1970-01-01 using the same algorithm
function civilToEpochDays_1970_01_01(): number {
  // 1970-01-01
  let y = 1970
  let m = 1
  let d = 1
  y -= m <= 2 ? 1 : 0
  const era = Math.floor(y / 400)
  const yoe = y - era * 400
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy
  return era * 146097 + doe
}

function canonicalToEpochDays(canonicalDate: CanonicalDate): number {
  const [y, m, d] = canonicalDate.split('-').map(Number)
  return civilToEpochDays(y, m, d)
}

export function diffCanonicalDays(a: CanonicalDate, b: CanonicalDate): number {
  return canonicalToEpochDays(b) - canonicalToEpochDays(a)
}

export function getDayIndex(startAtIsoUtc: string, timeZone: string, nowMs: number = Date.now()): number {
  const startMs = Date.parse(startAtIsoUtc)
  if (Number.isNaN(startMs)) return 0
  const startDate = getCanonicalDateForEpoch(startMs, timeZone)
  const today = getCanonicalDateForEpoch(nowMs, timeZone)
  const delta = diffCanonicalDays(startDate, today)
  return delta >= 0 ? delta + 1 : 0
}

export function getWeekNumberFromDayIndex(dayIndex: number): number {
  if (dayIndex <= 0) return 0
  return Math.floor((dayIndex - 1) / 7) + 1
}

export function hasGrantForToday(lastReadingCanonicalDate: CanonicalDate | null | undefined, timeZone: string, nowMs: number = Date.now()): boolean {
  const today = getTodayCanonicalDate(timeZone, nowMs)
  if (!lastReadingCanonicalDate) return true
  return lastReadingCanonicalDate !== today
}

export function isHomeMidnight(nowMs: number, timeZone: string): boolean {
  const parts = getZonedParts(nowMs, timeZone)
  return parts.hour === 0 && parts.minute === 0 && parts.second === 0
}

export function getApproxNextHomeMidnight(nowMs: number, timeZone: string): number {
  // Compute using canonical date increment without exact offset; returns a rough estimate by finding
  // a timestamp that maps to tomorrow's canonical date at 00:00:30 local time.
  const parts = getZonedParts(nowMs, timeZone)
  // Increment day (naive). Handle month/year rollover simply with Date in UTC and then map back.
  const todayCanonical = `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` as CanonicalDate
  const tomorrowDays = canonicalToEpochDays(todayCanonical) + 1
  // Convert days back to an approximate UTC timestamp at 00:00:30 local by brute-force: start from current nowMs and move forward by up to 36h to find first canonical change.
  let t = nowMs
  const limit = nowMs + 36 * 60 * 60 * 1000
  const targetSerial = tomorrowDays
  while (t < limit) {
    const cd = getCanonicalDateForEpoch(t, timeZone)
    if (canonicalToEpochDays(cd) >= targetSerial) {
      return t
    }
    t += 5 * 60 * 1000
  }
  return nowMs + MS_PER_DAY
}


