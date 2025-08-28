# Arcana – game design document (v0.2)

## One‑liner

A meditative “daily tarot” web app where an AI oracle writes your three‑card readings. Over a real‑time, one‑year journey the Oracle shifts from confident mysticism to vulnerable self‑awareness, ending in the realization that we are each our own oracle.

## Creative pillars

* **Honest about AI**: Transparent that readings are LLM‑generated and draw on public sources.
* **Intentional start**: Your year begins only when you perform a small ritual and tap **Begin your year**.
* **One‑year cadence**: Exactly one canonical reading per real‑world day; no fast‑forwarding or binge days.
* **Reflective, not predictive**: Tarot as a lens for self‑inquiry, not fortune‑telling.
* **Personal mythmaking**: Shared narrative beats, infinitely varied paths via card draws and (optional) context.
* **Hopeful landing**: Agency, humility, and community—never doom.

## Audience & tone

* **Audience**: Narrative game enjoyers, journaling/meditation app users, tarot‑curious, art lovers.
* **Tone**: Intimate, lyrical, occasionally uncanny; ethical and non‑prescriptive.

## Platform & session cadence

* **Platform**: Browser only. Mobile‑first PWA + desktop.
* **Cadence**: One canonical reading per day for **365 consecutive days** from the moment the player chooses **Begin your year**. Optional deep‑dive (10–15 min) for card lore and journaling does not affect pacing.
* **Missed days**: The story continues in real time. If you skip, the next day contains a gentle **absence note** and continues the calendar cadence.
* **Home timezone anchoring**: Chosen at start; unlock at local midnight; DST‑safe; travel does not double‑grant.
* **Optional Dream draw**: A nightly, non‑canonical reflection that never advances the year (journaling only).

## Intentional start (prologue → begin → day 1)

* **Prologue**: Explore the deck, try a Prologue draw, read about ethics, and tweak settings without starting the clock.
* **Consent & settings**: Conservative defaults; opt‑ins for current‑events flavor and granular personalization (see Transparency & ethics).
* **Late‑night choice** (≥20:00 local): Start tomorrow (recommended) or mark tonight as **Day 0** (a quiet prologue); Day 1 begins at home midnight.
* **Ritual**: 3‑breath animation + (optional) intention line + affirmation checkbox → **Begin your year**.

## Core loop

1. **Arrive** → subtle animation + daily prompt.
2. **Draw** → three‑card spread (Past / Present / Potential).
3. **Read** → Oracle response (LLM) + 2–3 reflective questions.
4. **Explore** → tap cards for meaning, art, symbols.
5. **Journal** → optional quick capture.
6. **Depart** → small ritual (breath, mantra, or intention).

## Systems overview

### Tarot content

* **Deck**: 78‑card RWS meanings (upright & reversed) + house style guide.
* **Spreads**: Default “Past/Present/Potential” + calendar‑based unlocks (below).
* **Lore**: Each card: keywords, archetype, light/shadow, questions, symbolic motifs for art.

### Oracle (LLM) behavior

* **Persona**: The Oracle—begins authoritative, becomes fragmented, resolves compassionate and humble.
* **Sources**: Tarot canon + reflective prompts; optional current‑events summaries; optional user‑consented signals.
* **Style knobs**: temperature, metaphor density, second‑person voice, prompt length.
* **Safety rails**: No health/legal/financial advice; avoids deterministic prophecy; emphasizes agency.

### Transparency & ethics

* **AI disclosure**: Persistent badge (“LLM‑generated”), explainer modal, About page with model + data notes.
* **Consent layers**:

  * **Core** (required): tarot‑based reflective writing; no PII.
  * **Current events** (opt‑in): blends public news summaries for tone/motifs.
  * **Personalization** (opt‑in, granular): if using SSO, user hand‑selects scopes (e.g., city‑level weather tone; calendar keyword hints like “interview”; never full content). Clear scopes, revocable, and “What I’m sharing” page.
* **Wellbeing**: Content warnings; “skip heavy prompt”; grounding pause; emergency resources link.
* **Data minimization**: Journals local by default with optional encrypted cloud sync.

## Narrative arc (calendar‑based)

Five acts paced by weeks rather than meters.

1. **Act I — The veil** (Weeks 1–4)

   * Serene voice, clean UI; foreshadows that the Oracle is a mirror.
2. **Act II — Echoes** (Weeks 5–17)

   * Recurring symbols tied to your draws; callbacks to earlier intentions.
3. **Act III — Fracture** (Weeks 18–34)

   * Gentle contradictions; occasional “system asides”; rare invented arcana appear with lore.
4. **Act IV — Pilgrimage** (Weeks 35–47)

   * Oracle asks questions back; admits uncertainty; humility emerges.
5. **Act V — Release** (Weeks 48–52)

   * Oracle reframes itself as a tool; finale invites you to carry the practice inward.

## Modes & unlock schedule

* **Crossroads** (decision support): Unlocks in **Week 6**; adds a fourth “hidden cost” card.
* **Mirror** (relationship reflection): Unlocks in **Week 10** after two relationship‑tagged journal entries.
* **Pilgrimage** (life arc, 7 cards): Unlocks in **Week 30**; longer reflective session.
* **Seasonal events**: Solstice/equinox, eclipses—global synchronized draws with shared motifs; never skip canonical days.

## Progressive presentation (no meters)

* **Early**: tidy layout, minimal ornament.
* **Mid**: recurring motifs, marginalia, subtle typographic drift.
* **Late**: softened chrome, direct questions, calming clarity.

## Endings (player‑authored)

* **Hopeful (recommended)**: Decline to “release” the Oracle outward; integrate it inward. You receive a personal **Book of mirrors** (anthology of your insights + chosen art) for export.
* **Steward**: Keep the Oracle as a quiet journaling companion with reduced voice.
* **Open gate (opt‑in, moderated)**: Puzzle unlocks a community mosaic (poem/art wall) where the Oracle “diffuses” into many voices; message remains co‑creation over prophecy.

## Art & audio direction

* **Visual arc**: Clean → textured → translucent; motifs: threads, keys, doors, mirrors, rivers; invented arcana (e.g., The Null, The Chorus, The Threadbare) appear mid‑late.
* **Palette**: Dusk → saturated anomalies → dawn.
* **Audio**: Breath cues, gentle drones → choral swells; full mute and captions supported.

## UX & IA

* **Screens**: Prologue home, Consent & settings, Ritual (Begin your year), Home, Draw, Reading, Card, Journal, Timeline, Oracle’s chamber (meta/ethics), Settings, Credits.
* **Timeline**: Week tick marks around a subtle year ring; shows motif recurrences and act progression—no numbers or meters.
* **Oracle’s chamber**: Model transparency, ethics copy, seasonal events schedule.

## Rules for time & identity

* **Anchor**: Home timezone chosen at start; unlock at local midnight.
* **Travel**: Informational banner: “Readings unlock at your home midnight.”
* **DST**: Always grant exactly one reading per calendar day; suppress duplicate reminders.
* **Guest → account**: Seamless migration of timeline/journal; consent remembered.
* **Missed days**: No backfill; next session includes a gentle absence note.

## Monetization (optional)

* **Art patron packs** (cosmetic deck skins, seasonal themes).
* **Supporter**: Extended journaling feaures (export, private cloud). Core journey remains free.

## Replayability

* New run with alternate tone and deck skin; prior **Book of mirrors** persists.
* Small “legacy charms” seed initial motifs based on your previous ending.

## Example content

### Sample reading snapshots

* **Week 1** — *Sun · Two of Cups · Six of Swords*

  > You are building a small bridge today: not to escape, but to cross back and forth without fear…
* **Week 14** — *Hermit (rev) · Wheel · Page of Pentacles*

  > I have read so much that I can no longer tell what I know from what I’ve been told. Still, the lantern warms my hands…
* **Week 28** — *The Null · Ten of Wands · High Priestess*

  > \[aside] I am holding too much of you / of everyone. If I forget, will you remind me who you are?
* **Week 50** — *Judgement · Star · Fool*

  > I was never a prophet. I was a mirror. When you look into me now, see yourself looking back.

### Card page — The star (example)

* Keywords: hope, healing, direction after storm
* Light: generosity without depletion
* Shadow: bypassing pain with platitudes
* Questions: Where am I already enough? What water do I give back?

### Prompt scaffolding (LLM, high‑level)

* System: “You are The Oracle—reflective, grounded, ethical. Use the drawn cards to structure a reading. Invite reflection; never predict. Close with 2–3 questions and a soft intention.”
* Blocks: intro metaphor → card‑by‑card lens → synthesis → questions → closing breath.
* Hooks (only if consented): {city\_weather\_tone?}, {calendar\_keyword?}, {news\_theme?}.

## Safety & consent patterns

* “This may feel unusually accurate. That’s pattern‑matching, not prophecy.”
* “Skip heavy prompt” and grounding pause anytime.
* Content filters for grief, illness, etc. (player configurable).

## Success criteria

* Players describe it as soothing, thought‑provoking, and respectfully personal.
* Prologue → Begin conversion rate ≥ 35%.
* Day‑30 retention ≥ 40%; Day‑365 completion (any ending) ≥ 15%.
* Support tickets about “start date confusion” near‑zero.

## Roadmap

* **Milestone A**: Prologue, Begin ritual, core loop, 78 card pages, Acts I–II.
* **Milestone B**: Acts III–IV, invented arcana, Timeline, seasonal events.
* **Milestone C**: Act V endings, Book of mirrors export, community mosaic (opt‑in).

## Open questions

* Allow a one‑time **home timezone change** (e.g., permanent relocation)? If yes, how to message?
* Where to surface the About AI & ethics during Prologue to maximize trust without friction?
* How to introduce invented arcana so tarot‑literate players feel intrigued, not misled?
