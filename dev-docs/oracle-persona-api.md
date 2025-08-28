## Oracle Persona API — Integration Notes

This document describes the persona system and how the Oracle API consumes it. No code here, just behaviors and interfaces.

### Persona schedule

- Acts (by week):
  - Weeks 1–4: Veil → `confident_mystical`
  - Weeks 5–17: Echoes → `pattern_recognizing`
  - Weeks 18–34: Fracture → `questioning_self`
  - Weeks 35–47: Pilgrimage → `vulnerable_humble`
  - Weeks 48–52: Release → `compassionate_mirror`

Each persona carries style knobs: tone, metaphor density, aside frequency, directness, humility, question count, and temperature.

### Safety rails (always on)

- No medical, legal, or financial advice.
- Avoid deterministic or prophetic claims; emphasize agency and reflection.
- Be respectful and non‑judgmental; offer invitations, not directives.
- This is reflection, not fortune telling.

### API: POST `/api/oracle`

Request (conceptual):

- `cards: string[]` — exactly three card display names (Past, Present, Potential)
- `weekNumber: number` — canonical week (1–52)
- `intention?: string` — optional user intention line
- `previewPersonaWeek?: number` — debug override for persona selection (does not advance time)

Response (conceptual):

- `reading: string`
- `cards: string[]`
- `weekNumber: number` — effective week used for persona
- `persona: string` — persona key
- `act: string` — act key
- `temperature: number` — used for this request
- `timestamp: string` — ISO8601

### Prompt structure (high-level)

- Intro image (1–2 sentences) → grounded mood
- Card-by-card reflections (Past, Present, Potential)
- Brief synthesis that invites agency
- 1–3 concise reflective questions (per persona style)

### Testing tips

- Use the Test Oracle page to preview voices: set “Persona Preview Week” (1–52) and run.
- Compare Week 1, 20, 45 outputs to verify arc drift and safety language.


