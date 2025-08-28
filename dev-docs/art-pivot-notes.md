## Art generation pivot: SVG attempt → external image API

Short version: We tried fully automatic SVG generation via Anthropic. The result: cohesive but visually underwhelming—primitive shapes, limited nuance. Even after enforcing curved paths and higher complexity, it still felt like “MS Paint but spiritual.” We’re pivoting.

### What we tried (and why it failed)
- Generator script `scripts/generate-card-svgs.ts` created 5 pilot SVGs.
- Tightened prompts to require cubic Bezier curves, path counts, ornamental borders.
- Outcome: technically valid, aesthetically meh. Not production quality.

### New approach
- Use a free public tarot image source with “high-quality” assets: `krates98/tarotcardapi` images folder.
- Added a proxy endpoint: `app/api/card-image/[id]/route.ts` that lists GitHub repo images and 307-redirects to the raw download URL.
- Updated `components/tarot-card.tsx` to render `/api/card-image/{id}` with a fallback to local SVG if present (our pilots remain for context/regression).

### Why this fits our constraints
- Free, public, accessible via API (GitHub Contents API).
- Zero manual download for 78 cards; caching with TTL to limit GitHub calls.
- Keeps our local pipeline simple; assets can later be swapped for a different source without touching UI.

### Notes
- We preserved the generated pilot SVGs in `public/cards/` for reference.
- If the external repo reorganizes filenames, our route attempts several id normalizations (with/without "the", hyphen/space variants).
- If we later secure a better free source, we only need to update the proxy.


