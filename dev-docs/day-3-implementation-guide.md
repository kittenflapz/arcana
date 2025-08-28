## Day 3: Oracle Evolution & Time Magic — Deep Implementation Guide

Goal: The Oracle evolves by week, time is anchored and fair, users get exactly one canonical reading per real-world day, missed days are acknowledged, the timeline feels alive, and the UI quietly transforms over the year.

## Objectives and non-goals

- **Objectives**:
  - Persona shifts across weeks/acts; style knobs and safety rails are explicit.
  - Home-timezone anchoring; midnight unlock; DST-safe; travel-safe.
  - Enforce exactly one canonical reading per calendar day.
  - Timeline ring with week ticks, progress, and subtle act markers.
  - Missed-day “absence note” woven into the next reading.
  - Progressive theme changes across acts.
- **Non-goals (today)**:
  - Seasonal events content authoring.
  - Advanced spreads beyond simple unlock gating.
  - Community or “Book of mirrors” export.

## Shared definitions

- **Home timezone**: IANA zone chosen at ritual start; never silently changes with device travel.
- **Canonical local date**: The calendar date in the home timezone.
- **Day index**: 1-based count from “Begin your year” at home midnight.
- **Week number**: floor((dayIndex - 1) / 7) + 1; used for persona and unlocks.
- **Grant**: The single daily entitlement to draw one canonical reading; refreshes at home midnight only.
- **Missed day**: Any canonical date with no reading logged by next unlock.
- **Acts**: Narrative phases mapped to week ranges (I–V).

## Architecture touchpoints

- **Domain modules**:
  - `lib/time.ts`: time math, home timezone helpers, unlock/grant calculation, week/day indexing.
  - `lib/oracle.ts`: persona schedule, style knobs, safety rules, prompt scaffolding for the Oracle.
  - `lib/progression.ts`: act schedule, unlocks, theme progression mapping.
  - `lib/timeline.ts`: transforms readings + days → timeline view model.
  - `lib/store.ts`: persist home timezone, start timestamp, lastGrantConsumedAt, todayReadingId, debug flags.
- **API surface**:
  - `app/api/oracle/`: accepts cards + context (dayIndex, weekNumber, consent flags); returns reading text + metadata.
- **Persistence (conceptual)**:
  - Journey/session: startAt (UTC), homeTimezone, consent flags.
  - Reading: readingId, canonicalDate (home), dayIndex, three cards, personaSnapshot, promptVersion, text, createdAt.
  - Journal: readingId → text.
  - Timeline events: optional motif references.
- **Local cache**:
  - Mirror the current grant state and latest reading to survive network hiccups; reconcile on reconnect.

## Morning block

### 1) Oracle persona system

- **Persona schedule**:
  - Week → act mapping (I–V) from the narrative arc.
  - For each act define style knobs: tone, metaphor density, aside frequency, directness, humility, question count, temperature range.
  - “Safety rails” always on: no predictions; no medical/legal/financial advice; agency-forward language.
- **Prompt scaffolding (conceptual)**:
  - Blocks: intro image → card-by-card reflections → synthesis → 2–3 questions → soft closing.
  - Optional hooks if consented: current-events motif, city-level weather tone, calendar hint—off by default.
- **Inputs to Oracle**:
  - cards, dayIndex, weekNumber, act, consent flags, any missedDay flag, intention (optional), motif recalls.
- **Outputs**:
  - reading body, reflective questions, personaSnapshot (for reproducibility), seeds of motifs.
- **Acceptance criteria**:
  - Distinct voice shift between Week 1, Week 20, Week 45 matching the arc.
  - Safety guarantees present in all outputs.
  - Persona is determined solely by weekNumber/act; deterministic for same inputs.
  - Toggle to preview any week’s persona without advancing time (for demos).

### 2) Timezone handling

- **Home timezone anchoring**:
  - Capture on “Begin your year”; persist; never auto-update from device tz.
- **Canonical day and unlock**:
  - Grant refreshes exactly at home midnight.
  - Day index computed from home-local calendar day boundaries since start.
- **DST**:
  - Always one grant per home-local calendar day, even if a day is 23 or 25 hours.
- **Travel**:
  - If device tz ≠ home tz: show banner “Readings unlock at your home midnight.”
- **Late-night start**:
  - ≥20:00 local: offer “start tomorrow” (recommended) or “Day 0 quiet prologue”; Day 1 begins at next home midnight.
- **Acceptance criteria**:
  - Changing device timezone never grants extra readings; grant strictly follows home tz.
  - Unlock ticks at the right instant through DST transitions.
  - Day index never skips or duplicates.
  - Banner reliably appears when traveling; disappears at home.

### 3) Reading availability logic

- **One-per-day enforcement**:
  - At each home midnight, issue exactly one unconsumed grant.
  - Creating a reading consumes the day’s grant; retries are idempotent for that date.
- **Idempotency**:
  - If creation is retried, same canonicalDate/dayIndex returns the existing reading.
- **No backfill**:
  - If a day is missed, the next day marks it as missed—no retroactive creation.
- **Dream draw**:
  - Non-canonical; never advances the year.
- **Acceptance criteria**:
  - Cannot create more than one canonical reading per canonical date.
  - Grant never double-issues in travel/DST scenarios.
  - Errors are user-friendly and actionable.

## Afternoon block

### 4) Timeline visualization (year ring)

- **Data**:
  - 365 nodes keyed by canonicalDate/dayIndex; flags: completed, missed, today, act.
  - Week tick marks and act segment overlays.
  - Motif recurrence indicators (minimal for now).
- **Presentation**:
  - Circular ring; subtle progress fill; small marks for missed days.
  - Tap/click a completed day to open its reading; today highlights; future days inert.
- **Performance**:
  - Precompute positions; avoid dynamic layout thrash; render efficiently on mobile.
- **Acceptance criteria**:
  - Today, past, future clearly distinguished.
  - Missed days subtly visible (no shame UI).
  - Week ticks align with home-week boundaries; acts legible.

### 5) Missed day handling

- **Detection**:
  - On new grant, if previous canonicalDate had no reading, mark it missed.
- **Oracle behavior**:
  - Pass a missedDay flag; prepend a gentle absence note in the next reading’s intro; never scold.
- **Timeline**:
  - Mark missed date; allow viewing a short “absence note” tooltip or detail.
- **Acceptance criteria**:
  - Exactly one absence note per missed day, presented once on the next reading.
  - No retroactive filling; history remains accurate and calm.

### 6) UI theme progression

- **Tokens and stages**:
  - Early: tidy, minimal ornament.
- **Mid**: recurring motifs and marginalia.
  - Late: softened chrome, warm clarity.
- **Implementation approach**:
  - Drive via act; use existing design tokens for color/blur/ornament.
  - Theme state derived from week/act; applied app-wide with override for demo.
- **Acceptance criteria**:
  - Visual shift is noticeable yet gentle at act thresholds.
  - No contrast or accessibility regressions; mobile-first layouts remain stable.

## Observability and safeguards

- **Events (conceptual names)**:
  - journey_started, grant_issued, reading_created, reading_failed, reading_viewed, day_missed, timezone_mismatch, persona_previewed, theme_stage_changed.
- **Metrics**:
  - Grant issuance vs consumption; missed-day count; read success rate; average reading latency; persona distribution by week.
- **Privacy**:
  - No PII; journaling local by default; clear consent scopes; opt-in for any contextual hooks.

## Testing matrix (behaviors)

- **Time math**:
  - Start at 19:59 vs 20:00; verify Day 0 option flow.
  - Cross DST forward/back days; verify one grant/day.
  - Travel across zones; verify banner and no extra grants.
- **Idempotency**:
  - Simulate network retry on reading creation; ensure single reading stored.
- **Persona**:
  - Weeks 1, 20, 45 snapshots show expected style drift; safety rails intact.
- **Missed days**:
  - Skip one day; next day shows absence note; timeline marks missed.
- **Timeline**:
  - Ring shows correct progress, week ticks, today highlight; mobile performance acceptable.
- **Theme**:
  - Act transitions flip theme state without layout jank or unreadable text.

## Dev and demo tools (switches)

- **Debug clock**: Temporarily override “now” and/or home timezone for testing; never ships to users.
- **Persona preview**: Pick a week to preview voice without advancing time.
- **Theme override**: Toggle act theme manually for visual QA.
- **Safety fallback**: Force sample reading if Oracle API fails, so demos never stall.
- **Fresh-state testing**: Clear local storage keys and truncate relevant tables before runs; keep a short reset checklist.

## Risks and fallback plan

- **Time math bugs**: Add guardrails around day boundary calculations; prefer conservative locking if ambiguity is detected.
- **Double-grant on DST/travel**: Add server-side dedupe keyed by canonicalDate + user.
- **Persona complexity**: If behind, ship 3-stage persona (early/mid/late) and fill the rest later.
- **Timeline complexity**: If behind, ship a linear progress bar for Day 3; circle ring on Day 4.

## Deliverables checklist (today)

- [ ] Persona schedule and prompt scaffolding defined and integrated.
- [ ] Home-timezone anchoring with midnight unlock; DST- and travel-safe grants.
- [ ] One-per-day enforcement with idempotency.
- [ ] Timeline ring MVP with week ticks and missed-day marks.
- [ ] Missed-day absence note flow.
- [ ] Theme progression tied to acts with demo override.

Related docs:
- Time handling details: `dev-docs/time-handling.md`


