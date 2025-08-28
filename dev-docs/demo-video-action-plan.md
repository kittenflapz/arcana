## Hackathon Demo Video — Action Plan (≤ 4 minutes)

### Goal

Show how Arcana works today (draw → oracle → journal) and spotlight how we can pivot to “Story Mode” with minimal changes using the Oracle Persona API.

---

### Outline & Timing (target 3:45–3:59)

0:00–0:10 — Title card

- **On-screen**: App logo/name + one-liner.
- **VO**: “Arcana is a daily tarot companion. The Oracle writes your reading; you write your story.”

0:10–0:45 — What it does (quick tour)

- **On-screen**: `daily` page draw → three cards revealed → Oracle reading → journal.
- **VO**: “Each day: draw three cards, get a short reading, and journal. One day at a time.”

0:45–1:35 — Three stages of the journey

- **On-screen**: Three browser profiles: Beginning (Week 1), Middle (Week ~20), Late (Week ~49). Show differences in voice as persona shifts.
- **VO**: “The Oracle’s persona evolves across the year: serene → pattern-aware → humble.”

1:35–2:25 — Under the hood (how it was made)

- **On-screen**: Highlight `lib/oracle.ts` (persona schedule + prompt scaffolding), `app/api/oracle/route.ts` (Claude call), and `dev-docs/oracle-persona-api.md`.
- **VO**: “We map weeks to personas, build a prompt, and call Claude. Safety rails and tone live in one place.”

2:25–3:20 — Story Mode pivot (minimal change, big effect)

- **On-screen**: Show `dev-docs/story-mode-implementation-plan.md`; briefly scroll to Phase 1. Optional: on `/test-oracle`, set a ‘story’ intention and `previewPersonaWeek` for a story-like output.
- **VO**: “To pivot to pure storytelling, we tweak the prompt—optionally add a `storyMode` flag—no UI changes. Same flow, different voice.”

3:20–3:45 — Close

- **On-screen**: Return to reading + journal, show completion and countdown.
- **VO**: “Reflective now, narrative next. One app, many voices.”

---

### Pre‑production Checklist

- Prepare 3 demo states in separate browser profiles (Beginning, Middle, Late)
- Draft voiceover script (below) and refine to hit ≤ 4 minutes
- Decide capture path (screen only now; VO added in edit)
- Install editor: CapCut Desktop (free), iMovie (free, macOS), or DaVinci Resolve (free)

---

### Staging the 3 demo states (no backend needed)

Use three browser profiles or separate browsers. Not logged in (avoids DB fetch). In each profile, visit the site and run a snippet to set local demo state.

LocalStorage key: `arcana-state` (Zustand persist). Example helper:

```js
// Open DevTools → Console and paste this once per profile
function setDemo(day, week, intention = '') {
  const k = 'arcana-state'
  const persisted = JSON.parse(localStorage.getItem(k) || '{}')
  const s = persisted.state || {}
  persisted.state = {
    ...s,
    hasBegun: true,
    currentDay: day,
    currentWeek: week,
    yearIntention: intention,
    todaysReading: null,
    canReadToday: true,
    readingCompletionPending: false
  }
  localStorage.setItem(k, JSON.stringify(persisted))
  location.reload()
}

// Beginning (Week 1)
setDemo(1, 1, 'Begin gently')

// Middle (Week ~20)
setDemo(140, 20, 'Keep the river thread')

// Late (Week ~49)
setDemo(343, 49, 'Release with clarity')
```

Tip: For a “story-ish” middle demo without code changes, on `/test-oracle` set `previewPersonaWeek` ~20 and intention like: “Story mode: short scene, second-person, let cards shape setting and a gentle turn.”

---

### Script (draft, pace ~140–155 wpm)

- Title (0:00–0:10): “Arcana — a reflective year of tarot.”
- Tour (0:10–0:45): “Draw three cards. The Oracle writes a brief reading. You journal. That’s it—no doom, just reflection.”
- Journey (0:45–1:35): “Early weeks are serene. Midyear notices patterns. Late year is humble, more direct. Same UI, evolving voice.”
- Under the hood (1:35–2:25): “We map weeks to personas in one file, build a prompt, and call Claude. Safety rails and tone are centralized.”
- Story Mode (2:25–3:20): “To go full storytelling, we toggle a prompt path—optionally a `storyMode` flag—and let each card drive a scene. No UI rewrite.”
- Close (3:20–3:45): “Reflective now, narrative next. One app, many voices. Thanks.”

Optional one-liners (pick one):

- “Less doomscrolling, more mirror-holding.”
- “Micro‑chapters from your own cards.”

---

### Capture

- macOS: QuickTime Player → New Screen Recording → Options: Mic off (record VO later), Show clicks off.
- Cross‑platform: OBS Studio (free). Scene: full‑screen display capture; hotkeys to start/stop.
- Record 4 short takes: (1) Title, (2) Tour, (3) Three stages, (4) Under the hood + Story Mode plan, (5) Close.

---

### Stitch & Edit (free tools)

- Fastest: CapCut Desktop (free)
  - Import clips → Trim → Add simple text titles/lower‑thirds → Add 12–16px margins for code shots → Export H.264 1080p.
- macOS-native: iMovie (free)
  - Create Movie → Drag clips → Trim → Titles → Cross‑fades → Export 1080p.
- Advanced: DaVinci Resolve (free)
  - Cut page for trims; Fairlight for VO leveling.

Lower‑third suggestions:

- “Acts & personas live in `lib/oracle.ts`”
- “Minimal pivot: Story Mode via prompt branch”
- “Safety rails: no advice, emphasize agency”

---

### Voiceover (script by LLM, voice by you or TTS)

- Script: Ask your LLM to condense the draft script to ~450–520 words and punch up for clarity.
- Record yourself: QuickTime Player → New Audio Recording; or Audacity (free) for noise reduction and compress/limit.
- TTS options (fast/free-ish):
  - macOS `say` command (robotic but instant)
  - CapCut built‑in TTS (varied voices)
  - ElevenLabs/PlayHT (better quality, limited free tier)

Example TTS (macOS):

```bash
say -v "Samantha" -r 180 -f script.txt -o vo.aiff && afconvert -f mp4f -d aac -b 128000 vo.aiff vo.m4a
```

Sync VO: Drop VO under clips, nudge trims to match beats; keep total under 4:00.

---

### Shots List (checklist)

- [ ] Title card (logo + one-liner)
- [ ] Daily flow: draw → reading → journal
- [ ] Three stages: Week 1, Week ~20, Week ~49 (separate profiles)
- [ ] Code peek: `lib/oracle.ts` personas + `buildOraclePrompt`
- [ ] API peek: `app/api/oracle/route.ts` (Claude call, temperature per persona)
- [ ] Doc peek: `dev-docs/story-mode-implementation-plan.md` (Phase 1)
- [ ] Test Oracle page: `previewPersonaWeek` + intention as “story mode” hint
- [ ] Closing screen + countdown

---

### Risk trims (if running long)

- Cut the journal typing shot (keep the card + reading)
- Shorten the code peek to one screen: personas + prompt blocks
- Use on‑screen captions instead of VO for the intro

---

### Delivery

- Export: 1080p, H.264, ≤ 200 MB
- Name: `arcana-hackathon-demo-<date>.mp4`
- Upload: internal drive/slack; attach `story-mode-implementation-plan.md` as “what’s next.”


