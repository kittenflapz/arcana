# Arcana – intentional start UX flow (v0.1)

## Overview
A gentle **Prologue → Begin your year → Day 1** funnel. Players can explore without time pressure, then choose an intentional start that anchors a one‑year cadence to a home timezone.

## Flow map (happy path)
1) **Welcome / Prologue Home**  
   → Explore the deck (optional)  
   → Try a Prologue Draw (optional)  
   → **CTA: Begin your year**

2) **Consent & settings**  
   - Consent levels: Core (required), Current events (opt‑in), Personalization (opt‑in, granular).  
   - Choose **Home timezone** (auto‑suggest; explain anchoring).  
   - Notifications (optional daily reminder).

3) **Late‑night choice** *(show only if local time ≥ 20:00)*  
   - Option A: **Start tomorrow** (recommended).  
   - Option B: **Count tonight as Day 0** (Prologue reflection) and start Day 1 tomorrow.

4) **Ritual: Begin your year**  
   - 3‑breath animation + intention text field (optional).  
   - Affirmation checkbox: “I understand this journey unfolds across one real‑world year.”  
   - Button: **Begin your year**.

5) **Confirmation**  
   - Stamp: *Year begun*.  
   - Shows Day 1 unlock time (“Your Day 1 opens at midnight in {Home TZ}.”)  
   - Offer to pin shortcut/add to home screen.

6) **Day 1**  
   - Canonical draw + reading + journaling.

---

## Screens & key copy
### 1. Welcome / Prologue Home
- Header: “A year of reflective tarot.”  
- Body: “Explore freely. When you’re ready, you’ll choose to begin.”  
- Buttons: **Explore** (secondary), **Begin your year** (primary).  
- Footer: “LLM‑generated readings • You are the oracle.”

### 2. Consent & settings
- **Core** (always on): “Generate reflective readings from tarot canon. No predictions.”  
- **Current events** (toggle off by default): “Weave the mood of the world (public news summaries) into metaphors.”  
- **Personalization** (accordion, off by default): “Optionally echo your life.” Fine‑grained scopes (e.g., City‑level weather tone; Calendar keywords; none are required).  
- **Home timezone**: Detected suggestion + edit. Copy: “Your daily reading unlocks at midnight in this timezone.”

### 3. Late‑night choice
- Title: “It’s late where you are.”  
- Body: “Start rested tomorrow, or mark tonight as a quiet prologue.”  
- Buttons: **Start tomorrow (recommended)**, **Mark tonight as Day 0**.

### 4. Ritual: Begin your year
- Breath cue animation (accessible, skippable).  
- Prompt: “Set an intention (optional).”  
- Checkbox: “I’ll return once a day. If I miss, I’ll simply continue.”  
- Primary: **Begin your year**.

### 5. Confirmation
- Message: “Your year has begun.”  
- Subtext: “Day 1 unlocks at **12:00 AM {Home TZ}**.”  
- Actions: **Enable reminder**, **Add to Home Screen**.

### 6. Day 1 reading
- Standard flow: intention breath → draw (Past/Present/Potential) → Oracle text (short/med/long per setting) → journal capture.

---

## Edge cases & rules
- **Guest → account migration**: timeline and journal migrate on signup; consent remembered.  
- **Missed days**: no backfill. Next session displays a brief, compassionate **absence note**.
- **Travel / timezone change**: The cadence remains anchored to **Home TZ** chosen at start. Informational banner when away: “Readings unlock at your home midnight.”  
- **DST**: Treat unlock as 00:00 Home TZ; never double‑grant or skip a day; if OS fires a duplicate reminder, suppress.  
- **Device change**: server‑anchored after signup; if guest, use local secure store + optional recovery link.
- **Privacy**: Personalization requires explicit scopes; show a “What I’m sharing” page; revocable anytime.

---

## Micro‑interactions
- Subtle “year ring” progress on the Timeline (week tick marks, no numbers).  
- After “Begin,” the UI chrome slightly shifts to mark Act I.

---

## Acceptance criteria (design contract)
- Users can explore the Prologue without starting the year.  
- The year does not begin until the **Begin your year** ritual confirm.  
- Day unlocks occur at **midnight in Home TZ**.  
- Skipped days are acknowledged (absence note) and do not accumulate.  
- Consent defaults conservative; personalization off until granted.  
- Late‑night branch offered at ≥ 20:00 local time.  
- Copy explicitly states the one‑year cadence.

---

## Metrics
- Prologue → Begin conversion rate.  
- Percentage choosing Day 0 vs Start Tomorrow.  
- Reminder opt‑in rate.  
- Week‑1 retention; Day‑30 retention.  
- Support tickets tagged “start date confusion” (target: near‑zero).

---

## Open questions
- Should users be allowed to **change Home TZ** once (e.g., permanent relocation)? If yes, when/how?  
- Offer a “Sabbath mode” (one planned skip/month) with different absence copy?  
- Where to best surface the **About AI & ethics** page during Prologue without breaking flow?

