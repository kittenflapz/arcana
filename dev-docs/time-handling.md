## Time Handling & Daily Grants — Implementation Notes

Purpose: Document precise behaviors for home-timezone anchoring, daily reading grants, DST/travel handling, and testing. No code, just truths the app must uphold.

### Key terms

- **Home timezone**: IANA zone chosen at “Begin your year.” Never auto-changes with device travel.
- **Canonical date**: The calendar date in the home timezone (YYYY‑MM‑DD).
- **StartAt**: ISO UTC timestamp when the player taps “Begin your year.”
- **Day index**: 1-based number of canonical days since StartAt (inclusive). If today is the start day, dayIndex = 1.
- **Week number**: floor((dayIndex − 1)/7) + 1; used for persona and unlocks.
- **Grant**: The one-per-day entitlement to create a canonical reading; refreshes at home midnight.
- **lastReadingCanonicalDate**: The canonical date of the most recent canonical reading for the current run.
- **Timezone mismatch**: Device timezone ≠ home timezone; show an informational banner.

### Behaviors

1) Begin year
- Capture `homeTimezone`, set `startAt` (UTC now), initialize `dayIndex = 1`, `weekNumber = 1`, and `canReadToday = true`.
- Do not allow auto-changes to `homeTimezone` based on device changes.

2) Daily unlock (home midnight)
- A new grant is available when the home-local date changes.
- `canReadToday = (todayCanonicalDate !== lastReadingCanonicalDate)`.
- No double-grant across DST transitions; exactly one grant per canonical date.

3) Reading creation
- Consumes the day’s grant; subsequent attempts on the same canonical date should be idempotent and surface the same reading.
- After success: `lastReadingCanonicalDate = todayCanonicalDate`, `canReadToday = false`.

4) Missed days
- On new-day recompute, if the gap between `lastReadingCanonicalDate` and `todayCanonicalDate` > 1, mark those intervening days as missed.
- The next reading should include a gentle absence note once (no shaming; no backfill).

5) Persona coupling
- `weekNumber` is derived from `dayIndex`. Persona and act selection use `weekNumber` only.
- Preview/debug tools may override the effective week for voice testing without advancing time.

6) DST and travel
- DST: Regardless of 23/25-hour days, issue exactly one grant per canonical date.
- Travel: If device tz ≠ home tz, display: “Readings unlock at your home midnight.” Never issue extra grants for travel days.

7) Idempotency (conceptual)
- Server-side idempotency key = `{userId}|{canonicalDate}`. Repeated create returns the stored reading.
- No backfill: Cannot create readings for past canonical dates.

### State surfaces (conceptual)

- Stored fields: `homeTimezone`, `startAt`, `currentDay` (derived), `currentWeek` (derived), `canReadToday`, `lastReadingCanonicalDate`, `timezoneMismatch`.
- Actions: `beginYear(timezone, intention?)`, `setReading(reading)`, `recomputeTime(now?)` (updates day/week/grant/mismatch on app focus or timer).

### UI messaging

- **Travel banner**: If `timezoneMismatch`, show a non-blocking banner: “Readings unlock at your home midnight.”
- **Next unlock** (optional): Show relative time to next home midnight if useful.
- **Absence note**: On the first reading after missed days, prepend a single, gentle note.

### Testing matrix

Time boundaries:
- Start at 19:59 vs 20:00 local; ensure “Day 0” option and recommended “start tomorrow” path behave.
- Cross a DST forward day (23h) and a DST back day (25h); ensure exactly one grant per canonical date.

Travel scenarios:
- Change device timezone away from home; verify banner appears and `canReadToday` logic does not double-grant.
- Return to home timezone; banner disappears.

Grant/idempotency:
- Create a reading → `canReadToday` becomes false; retry creation returns the same reading (no duplicates).
- Skip a day; next unlock sets `canReadToday = true` and flags a missed day; absence note appears once on next reading.

Persona sanity:
- Week 1 vs Week 20 vs Week 45 show expected tone drift; persona preview does not affect grant or `dayIndex`.

### Reset guidance (local dev)

- Clear persisted state: remove the `arcana-state` local storage key in the browser to reset the run.
- If using a cloud store later (e.g., Supabase), truncate journey/reading tables for the test user and clear local storage to test fresh states. Keep a simple checklist for repeatable resets.

### Known limitations & notes

- Without a server clock source, different client clocks may drift. Prefer server timestamps for canonicalization when feasible.
- Month/year boundaries are handled by canonical dates; grant logic keys off the date label, not elapsed hours.
- If a one-time home timezone change is allowed in the future (relocation), messaging and one-time migration must be explicit.


