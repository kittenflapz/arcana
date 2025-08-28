## Tarot card images via Anthropic (SVG-only plan)

Because we only have an Anthropic key and zero desire to feed another SaaS goblin, the plan is to have Claude generate vector SVG art directly (no raster model). This gives us consistent style, tiny files, and full control in the app.

### Goals
- **One image per card (78 total)**: Consistent style across Major and Minor Arcana.
- **Self-contained SVGs**: No external fonts/images; render perfectly in browser.
- **Automation-first**: Scripted generation, retries, and idempotency.
- **Style coherence**: Same visual language, palette, and layout grid.

### Constraints
- **Only Anthropic API** for generation (no other paid services).
- **Determinism-ish**: Low temperature, fixed style prompt; we’ll use a few-shot style anchor after initial tests.
- **App integration**: Store as `public/cards/{cardId}.svg`; app chooses which to display; no text label inside SVG (UI overlays the name).

## Visual direction (Minimal mystic linework)
- **Aspect ratio**: Portrait 700×1200 viewBox (`0 0 700 1200`).
- **Composition**: Framed border, central emblem, secondary motifs, subtle geometric scaffolding.
- **Linework**: Clean strokes, limited path count, no script/filters, optional gentle gradients.
- **Typography**: None in-SVG; titles live in UI.
- **Palette**: Limited, with suit-based accents to keep the deck legible at a glance.

### Palette mapping
- **Base inks**: `#0f0f11` (near-black), `#f7f4ef` (paper-cream background).
- **Majors accent**: `#7a5cff` (violet) + `#f0c34a` (soft gold).
- **Cups accent**: `#4a90e2` (blue).
- **Wands accent**: `#e06a2b` (ember orange).
- **Swords accent**: `#7f8c99` (steel gray).
- **Pentacles accent**: `#3aa374` (green).

Style rule: 1–2 accents max per card; background is cream; lines are near-black; occasional radial gradient for depth, kept subtle.

### SVG spec (what Claude must output)
- Root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1200" width="700" height="1200" role="img" aria-label="{Card Name} – tarot illustration">`.
- No external refs: no `<image>`, no web fonts, no script.
- Use `<defs>` sparingly; gradients allowed; unique ids must be prefixed with the card id (e.g., `fool-grad-a`).
- Grouping: top-level `<g id="art">` for easy theming; optional `<g id="border">`.
- File size target: ≤ 50 KB per card (prefer ≤ 25 KB).
- No embedded text labels; the UI supplies name and metadata.

## Prompting strategy

### System message (fixed)
Instruct Claude to output only SVG and to adhere to the style:

```text
You are a meticulous SVG illustrator. Output a single, valid, self-contained SVG. Do not include explanations.
Style: minimal, sacred-geometry-inspired line art; portrait aspect 700×1200; cream background; near-black strokes; 1–2 suit/arcana accent colors; framed border; central emblem + 1–2 symbolic motifs; no text.
Constraints: no external images or fonts; no script; ids must be prefixed with the provided card id; total size small.
Output: ONLY the <svg>...</svg> element.
```

### User message (template)
We pass each `TarotCard` from our deck with suit/keywords/symbolism hints. The script will render this template per card:

```text
card_id: {id}
card_name: {name}
arcana: {arcana}
suit: {suit or "none"}
keywords: {comma-separated}
meaning: {meaning}
symbolism_hints: {symbolism}

Task: Create a cohesive SVG illustration following the style guide. Use the palette:
- base: #0f0f11 lines on #f7f4ef background
- majors accent: #7a5cff and/or #f0c34a
- cups accent: #4a90e2
- wands accent: #e06a2b
- swords accent: #7f8c99
- pentacles accent: #3aa374

Composition: framed border; central emblem that embodies the card; 1–2 smaller motifs from the hints; subtle geometry grid; no text.
Ids: prefix all defs and element ids with {id}-
```

### Few-shot style anchor (after test phase)
- Generate 3–5 “golden” examples first.
- Save the best 1–2 into the prompt as inlined exemplars (truncated if needed) to stabilize style for the full batch.

## Test cards (pilot batch)
- **The Fool**: precipice, satchel, white rose, small sun, open sky.
- **The Tower**: struck tower, lightning, falling crown/stars, sharp diagonals.
- **Two of Cups**: twin cups, caduceus, gentle arc/bond.
- **Seven of Swords**: strategy/stealth, five + two blades motif, moon.
- **Queen of Pentacles**: nurturing + earth, pentacle wreath, gentle vines.

Success criteria: consistent border/geometry, readable silhouettes at 200px tall, accent choices match suit/arcana, no stray text.

## Automation plan

### Directory layout
- `public/cards/{cardId}.svg` — final assets (committed).
- `scripts/generate-card-svgs.ts` — Node script using `@anthropic-ai/sdk`.
- `data/card-prompts.json` — optional frozen prompts per id for reproducibility.
- `tmp/svg-gen-log.jsonl` — run log with status and token counts.

### Script flow
1. Load deck from `arcana/lib/tarot.ts` via a small helper that exports JSON (or import and map to POJOs).
2. For each card id:
   - Skip if `public/cards/{id}.svg` exists unless `--overwrite`.
   - Build user prompt from the template; include symbolism/keywords.
   - Call `anthropic.messages.create({ model: "claude-3-5-sonnet-latest", temperature: 0.2, max_tokens: 4000, messages: [...] })`.
   - Validate: ensure `<svg` root, required viewBox, no `<script>`/`<image>`; optional SVGO minify.
   - Write file; log metrics; backoff + retry (3x) on transient errors.
3. Concurrency: 1–2 in parallel to respect rate limits; exponential backoff (250ms → 2s).
4. Idempotency: checkpoint JSON so reruns resume where left off.

### Validation checklist
- Contains `<svg` root with the given viewBox and aria-label.
- No `<script>`/`<image>`/external references.
- File size under target.
- Renders in a headless parse (simple XML parse is enough).

## Integration notes (app)
- Pathing: image url will be `/cards/{id}.svg` which Next.js serves statically from `public/`.
- In `components/tarot-card.tsx`, set the card art `<img src={`/cards/${id}.svg`}/>` or inline via `next/image` (no optimization needed for SVG).
- Keep the overlay/title handled by the UI (no in-SVG text).

## Manual QA pass (after batch)
- Spot-check 10 majors + 10 minors for style cohesion.
- Verify suit accent consistency and recognizable motifs.
- Replace any oddballs by rerunning with a short “motif emphasis” hint.

## Timeline
- Day 1: finalize style + generate 5 pilots; pick 2 exemplars.
- Day 2: run full script for Majors (22), QA, fix-ups.
- Day 3: run Minors by suit (4×14), QA each suit before proceeding.

## Risks and mitigations
- **Style drift**: use few-shot exemplars and strict system message; keep temperature low.
- **Token/length issues**: keep prompts concise; avoid dumping huge meanings; rely on keywords/symbolism.
- **SVG bloat**: validate and optionally minify; ask for fewer paths.
- **Rate limits**: throttle; resume via checkpoint.

## Next steps
1. Approve the style and palette above.
2. I’ll script the generator and produce the 5 pilot cards.
3. Lock exemplars, then batch-generate the rest.

### Local run instructions
- Ensure Node deps installed: `npm i` in `arcana/`.
- Create `arcana/.env.local` with: `ANTHROPIC_API_KEY=sk-ant-...`
- Run pilots: `npm run svg:pilots` (writes `public/cards/*.svg`).
- Run all: `npm run svg:all`


