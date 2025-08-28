## Tarot Story Mode — Minimal-Change Implementation Plan

### Objective

Shift from a game-ish “journey of hope” to a pure storytelling experience where the Oracle delivers daily micro‑chapters inspired by the three drawn cards. Reuse the existing UI/flow; minimize code changes by driving behavior through the Oracle Persona API and prompt scaffolding.

### Constraints we’re honoring

- **No UI overhaul**: Keep `daily` flow (Draw → Reading → Journal → Waiting) and card interactions as-is.
- **Minimal code additions**: Prefer configuration, prompt text, and existing API parameters. If code changes are needed, keep them scoped to the Oracle API/prompt builder.
- **Safety & ethics unchanged**: Preserve rails from the GDD and persona notes.

### What exists today (baseline)

- **Acts and personas**: Weeks map to personas (veil → echoes → fracture → pilgrimage → release) with style knobs (tone, temperature, question count). See `dev-docs/gdd.md` and `dev-docs/oracle-persona-api.md`.
- **Endpoint**: `POST /api/oracle` takes `{ cards: string[3], weekNumber, intention?, previewPersonaWeek?, consent? }` and returns `{ reading, persona, act, temperature, ... }`.
- **Prompt scaffolding**: Intro image → card reflections → synthesis → 1–3 questions. Concise (≈170–220 words). Safety rails appended.
- **UI**: `app/daily/page.tsx` renders the three cards, fetches the Oracle reading, then journaling. Renders Markdown already.

### Story Mode concept (content, not code)

- **Daily chapter**: Treat each reading as a micro‑story scene (second‑person, lyrical, occasionally uncanny). Cards anchor imagery and beats; questions remain optional garnish.
- **Continuity illusion**: The Oracle references recurring motifs and yesterday’s mood without hard memory. (Phase 2 adds a tiny prompt memory if desired.)
- **Persona arc as narrative arc**: Later acts (fracture/pilgrimage) feel stranger and more self‑aware; release is clear and compassionate. This already maps to the GDD.

### Phase 0 — Zero-code pilot (today)

- **Use intention as a soft story switch**: During internal testing, set intention like: “Story mode: write today as a short scene; second‑person; let the cards shape setting, tension, and a gentle turn.” The current prompt will still produce a story‑ish reading.
- **Use Persona Preview**: On `/test-oracle`, set `previewPersonaWeek` to 18–34 (fracture) or 35–47 (pilgrimage) to increase narrative strangeness while preserving rails.
- **Use calendar hint (optional)**: Provide `consent.calendarHint` like: “chapter motif: doors and mirrors” or “callback: river thread,” to bias continuity.

Example request (no code changes):

```json
{
  "cards": ["The Moon", "Seven of Swords", "Two of Cups"],
  "weekNumber": 20,
  "intention": "Story mode: write a short, second-person scene with a gentle turn.",
  "consent": { "calendarHint": "callback: river thread" },
  "previewPersonaWeek": 20
}
```

Success criteria for Phase 0:

- Outputs feel like micro‑fiction grounded by the three cards.
- Safety language remains intact; no UI changes required.

### Phase 1 — Single-flag, minimal backend change (recommended)

Scope: Add a “story mode” branch in the prompt builder and a way to toggle it, leaving the UI untouched.

- **Add request knob**: `storyMode?: boolean` on `POST /api/oracle`.
- **Prompt branch** (when `storyMode`):
  - Blocks: Scene opener (1–2 sentences) → three card‑anchored beats (setting, tension, turn) → micro‑resolution or cliff‑softening → optional 1 short question.
  - Increase word count envelope: 220–320, keep concise.
  - Raise creative energy: higher metaphor density allowed; asides rare but permitted in later acts.
  - Keep safety rails verbatim.
- **Temperature**: Bump per‑act by ~+0.1–0.2 in story mode. Max tokens ~300–350.
- **Global toggle (optional)**: `ARCANA_STORY_MODE=1` so ops can enable universally without FE changes. If set, default `storyMode = true` unless explicitly overridden.

Why this is minimal:

- Change is isolated to `lib/oracle.ts` (prompt composition) and `app/api/oracle/route.ts` (parameter + tokens). The UI keeps rendering Markdown.

### Phase 2 — Tiny memory for continuity (still minimal)

Keep it optional; ship behind the same flag.

- **Request field**: `previousSummary?: string` (2–3 sentences), composed by trimming yesterday’s reading on the client or server. If absent, the prompt still works.
- **Prompt usage**: Add a soft “Previously” line to encourage threads: motifs, tone callbacks, gentle echoes.
- **No schema changes**: We already store yesterday’s reading; summarization can be heuristic (first 2 sentences) if we don’t want an LLM call.

### Prompt scaffolding (story mode) — proposed text

Use these substitutions when `storyMode` is true. Keep existing safety rails.

- **Instruction**: “Write a brief micro‑story in second person. Let each card shape a scene beat. Avoid fortune‑telling; favor concrete images.”
- **Blocks**:
  - Scene opener (1–2 sentences) that grounds mood and place
  - Three beats tied to Past / Present / Potential (image → tension → turn)
  - Soft landing (resolve a thread or leave a gentle open door)
  - Close with 0–1 concise reflective question (optional)
- **Style**:
  - Metaphor density: medium→high in fracture/pilgrimage; medium elsewhere
  - Aside frequency: rare→occasional in later acts
  - Temperature bump: +0.1–0.2 over act default; max tokens 300–350

### Rollout plan

1. **Pilot (Phase 0)**: Editorial validate on `/test-oracle` with intention/calendarHint + preview weeks.
2. **Enable Phase 1** behind `ARCANA_STORY_MODE` in staging; verify outputs across Week 1, 20, 45.
3. **Gradual prod enable**: 10% traffic for a week; watch for safety regression and token costs; then 100%.
4. **Optional Phase 2**: Add `previousSummary` once we’re happy with voice continuity.

### QA checklist

- Persona arc reflects GDD: veil calm → echoes patterning → fracture strangeness → pilgrimage humility → release clarity.
- Safety rails present in all outputs; no predictive claims.
- Length within bounds; Markdown renders cleanly in `daily` and `journal` views.
- Questions (if any) ≤ 1 in story mode; none are prescriptive.

### Metrics & observability

- Log (server): `mode`, `act`, `persona`, `temperature`, `tokens`, response length.
- Product metrics: finish rate of reading, journaling open rate, text copy events, Day‑7 retention deltas.

### Risks & mitigations

- **Over‑purple prose**: Cap metaphor density by act; keep directness medium–high in late acts.
- **Safety drift**: Keep rails verbatim; monitor with sampling; add automated lint if needed.
- **Token costs**: Slight bump; cap max tokens to 350 and keep word target tight.

### Acceptance criteria

- With zero code changes, editorial tests produce story‑like readings that feel coherent and safe.
- With Phase 1 enabled, story mode is toggleable via flag/param, UI unchanged.
- Optional Phase 2 adds gentle continuity without schema changes.

### Appendix — Example requests

Phase 1 (with `storyMode`):

```json
{
  "cards": ["Death", "Two of Cups", "Seven of Swords"],
  "weekNumber": 34,
  "storyMode": true,
  "intention": "Story mode: a brief scene with concrete images.",
  "consent": { "calendarHint": "callback: keys and doors" }
}
```

Phase 2 (adds a tiny previous summary):

```json
{
  "cards": ["The Star", "Eight of Cups", "Wheel of Fortune"],
  "weekNumber": 36,
  "storyMode": true,
  "previousSummary": "Yesterday you stood at the river’s lip, key cold in your palm, listening for the door that sounded like your name.",
  "intention": "Story mode: carry forward the river motif."
}
```

That’s it. The Oracle gets to be a novelist now, and we didn’t even move a pixel.


