## Day 4: Polish & Advanced Features — Implementation Guide

Goal: Presentation‑ready experience with ethical settings, installable PWA, a guided demo path, one advanced spread, a seasonal moment, and resilient error/loading UX — all without breaking the one‑reading‑per‑day covenant.

## Scope today (from the 5‑day plan)
- Settings page: consent layers, AI transparency
- Hardcoded demo progression: 30‑day simulation for showcases
- Advanced spreads: Crossroads (unlocks Week 6+)
- Solstice event: Winter Solstice (December) special, non‑canonical draw
- Error handling and loading states: consistent, calming, informative

## Objectives and non‑goals
- Objectives
  - Centralize ethics, transparency, and consent controls per GDD.
  - Provide a deterministic “demo mode” that shows the arc quickly.
  - Introduce Crossroads spread with a fourth “Hidden Cost” position.
  - Deliver a globally synchronized solstice moment that never consumes the daily grant.
  - Standardize loading states, empty states, and error surfaces across key flows.
- Non‑goals
  - Full personalization hooks beyond toggles (keep placeholders if needed).
  - Mirror/Pilgrimage spreads (later milestones).
  - Full seasonal content calendar (ship exactly one high‑quality event).
  - Monetization/export/community features.

## Architecture touchpoints
- Settings and consent
  - Surfaces: Settings page, Oracle’s chamber/about, Prologue reminders.
  - State: consent flags, transparency badge preference, wellbeing toggles.
  - Persistence: local first; sync to profile if signed in.
- Demo progression
  - App‑level flag (env or local) determines source of time/persona.
  - Deterministic seeds for “Day N → cards/persona snapshot/reading stub”.
  - Isolation: demo does not mutate canonical journey data.
- Spreads
  - Spread registry with unlock gating by week.
  - Crossroads adds a fourth position surfaced in UI and prompts.
- Solstice events
  - Event registry with solstice schedule and metadata (target: Winter/December solstice).
  - Event draw type is non‑canonical and independent of daily grant.
  - Copy motif: "Longest Night" (return of light); optional hemisphere‑aware alt copy (stretch goal).
- Error and loading surfaces
  - Unified loading patterns for card draw, Oracle, journal sync, timeline.
  - Error taxonomy mapped to user‑facing messages and recovery paths.

## Morning block

### 1) Settings page — Transparency, consent, wellbeing
- Content (aligned to GDD “Transparency & ethics”)
  - AI disclosure: persistent badge toggle (badge never fully hides disclosure; toggling only affects presentation density).
  - Consent layers:
    - Core (required): tarot‑based reflective writing; no PII.
    - Current events (opt‑in): tone/motif blending from public summaries.
    - Personalization (opt‑in, granular): city‑level weather tone; calendar keyword hints. Clear “What I’m sharing” copy and a one‑tap “Revoke all”.
  - Wellbeing: content warnings, “skip heavy prompt,” grounding pause, resources link.
  - Time and identity: show home timezone, explanatory copy about unlocks at home midnight, travel banner behavior.
- UX principles
  - Defaults conservative; everything legible at a glance.
  - Plain language, no dark patterns; emphasize agency.
  - Changes are reversible and auditable (brief change log text).
- Acceptance criteria
  - All toggles persist across sessions; sign‑in users sync to profile.
  - AI transparency present across the app regardless of toggle state.
  - Revoking optional consents updates upcoming readings; no retroactive edits.
  - Wellbeing actions reachable from reading screens and settings.

### 2) Hardcoded demo progression — 30‑day showcase
- Purpose
  - Enable a three‑minute demo that conveys the year‑long arc.
- Behavior
  - Toggleable “Demo mode” swaps live time for a curated sequence: preselected week markers (Weeks 1, 6, 20, 34, 45), pre‑set spreads/cards/persona snapshots, and exemplar readings or excerpts.
  - Demo mode is clearly labeled and does not consume/alter canonical grants.
  - Fast‑forward controls to jump between highlights; optional autoplay script.
- Data and isolation
  - Deterministic seeds for cards per highlight; persona text templates per act.
  - Local storage namespace isolated from real user data; prominent “Exit demo” restores normal flow.
- Acceptance criteria
  - Presenter can jump between five curated moments reliably within seconds.
  - No leak of demo state into a signed‑in journey.
  - Demo copy reflects act‑appropriate tone shifts.

## Afternoon block

### 3) Advanced spreads — Crossroads (Week 6+)
- Design
  - Four positions: Past, Present, Potential, Hidden Cost.
  - Unlock at Week 6; prior to unlock, show teaser copy and the unlock schedule.
  - Once unlocked, user can choose Crossroads instead of the default spread; still one canonical reading per day.
- Oracle behavior
  - Persona and prompt scaffolding incorporate the fourth position deliberately (especially synthesis and reflective questions around trade‑offs).
  - Safety rails unchanged (no prediction, agency‑forward).
- Acceptance criteria
  - Gating respects week number; travel or DST cannot unlock early or regress unlocks.
  - UI clearly communicates the extra position and its meaning.
  - Timeline and reading history accurately label the spread used.

### 4) Solstice event — One special moment (Winter/December)
- Theme and intent
  - Motif: The Longest Night — tending embers, release, and the return of light.
  - Tone: Gentle, communal, reflective; emphasizes agency and non‑prediction.
- Schedule and window
  - Window: December solstice day, fixed UTC (00:00–23:59 UTC). Exact astronomical minute not required for MVP.
  - Pre‑event: subtle banner appears 24 hours prior; tap opens an info sheet with timing and intent.
  - Post‑event: a small ribbon remains for 24 hours with recap and journaling access.
- Flow
  - Home banner → Event page with intro copy → 1‑card symbolic pull (non‑canonical) → brief reflection prompt → optional journaling → completion toast and timeline badge.
  - If a canonical daily reading occurs that day, both flows remain clearly separated and independently completable.
- Non‑canonical and storage
  - Does not consume the daily grant and never advances the day index.
  - Stores an event record locally (and to profile if signed in): event id, timestamp, symbolic card id/name, reflection text.
- UI surfaces
  - Home banner, Event page, Timeline badge (distinct solstice icon), optional “About the Solstice” sheet.
  - Copy variant (stretch): If home timezone is Southern Hemisphere, offer inclusive framing without mislabeling the event.
- Offline and resiliency
  - If offline within the window: allow the symbolic pull (local RNG seed), journaling, and mark as “pending sync.”
  - On reconnect: reconcile and attach a server timestamp without altering the local completion moment.
- Acceptance criteria
  - Pre‑event banner appears/dismisses correctly; event opens only during the UTC window.
  - Completing the event never affects the daily grant; timeline shows a distinct solstice badge.
  - Offline completion works; later sync preserves completion and journaling text.
  - Clear separation from the daily reading; no overlap in histories or counters.
  - Debug toggle can force the solstice window for QA.

### 5) Error handling and loading states — Calm and consistent
- Surfaces and patterns
  - Loading: considerate spinners/skeletons with short, reassuring copy.
  - Empty states: instructional and minimal; never accusatory.
  - Errors: friendly messages, next steps, and a “Try again” or “Use fallback” option.
  - Oracle failures: present a safe fallback reading excerpt or invite journaling-only mode; never dead‑end.
  - Offline: clear indicator; suppress retries that will fail; queue journal updates.
- Error taxonomy (examples)
  - Network/timeout, LLM unavailable, auth/session, storage/quota, PWA update needed.
- Acceptance criteria
  - All key screens (draw, reading, journal, timeline, settings) have consistent loading and error behavior.
  - Failure of Oracle or network never blocks journaling.
  - Errors are logged with lightweight, privacy‑safe metadata for later analysis.

## Observability and switches
- Events (conceptual)
  - settings_changed, pwa_installed, demo_mode_toggled, demo_jump, spread_selected, seasonal_event_viewed, seasonal_event_completed, winter_solstice_viewed, winter_solstice_completed, oracle_failed, offline_detected, retry_clicked, fallback_used.
- Debug switches (non‑shipping)
  - Force offline, simulate LLM failure, preview week persona, force solstice event window, force winter solstice success/failure, enable demo mode, theme override.

## Testing matrix
- Settings and consent
  - Toggle persistence (guest vs signed‑in), revoke all, transparency badge visibility.
- Demo progression
  - Toggle on/off; jump to each highlight; exit demo; ensure no data contamination.
- Crossroads spread
  - Pre‑unlock teaser, post‑unlock availability, timeline labeling, one‑per‑day enforcement preserved.
- Solstice event (Winter/December)
  - Pre‑event banner timing (24h), window gating at UTC boundaries, event page accessibility, completion path, and timeline badge.
  - Coexistence with daily reading (present/absent permutations).
  - Offline completion with later reconcile; idempotent completion on retry.
- Error/loading
  - Simulated LLM/network failures across screens; journaling fallback; offline queue and later reconcile.

## Risks and mitigations
- Risk: Demo mode contaminates real data.
  - Mitigation: Separate storage namespace; guardrails on toggling; visual watermark while active.
- Risk: Advanced spread complicates prompts and UX.
  - Mitigation: Keep copy simple; let default spread remain the primary path; ship Crossroads with clear labeling.
- Risk: Seasonal event collides with daily grant logic.
  - Mitigation: Separate flow and data model; explicit non‑canonical path; tests for coexistence.

## Deliverables checklist (today)
- Settings page with consent layers, transparency, wellbeing controls.
- Demo mode with five curated highlights and easy exit; no data contamination.
- Crossroads spread gated at Week 6 with clear UI and history labeling.
- Winter Solstice (December) event implemented with non‑canonical flow and timeline badge.
- Unified loading, empty, and error states across draw/reading/journal/timeline/settings.
