## Arcana Hackathon Demo — Voiceover Script (≈ 3:20–3:45)

[0:00–0:10] Title

Hi — this is Arcana, a daily tarot companion. You draw cards. The Oracle writes a short reflection. You write your story. One day at a time.

[0:10–0:45] Quick tour

Let’s take a day. I tap “Draw,” three cards flip — Past, Present, Potential. The Oracle speaks: a concise reading, grounded, reflective, never predictive. Then I journal a few lines and close the loop. No binges, no doom; just one thoughtful page a day.

[0:45–1:35] Three stages of the journey

Across the year, the Oracle’s voice evolves. Early weeks are serene and lightly mystical — like a calm friend with very good tea. Midyear, it notices patterns and offers clearer mirrors: call-backs to motifs and intentions. Late year, the voice is humble and candid — fewer flourishes, more clarity, more you. Same UI, different persona, so it feels like growth without adding complexity.

[1:35–2:25] Under the hood

Here’s the secret: most of the magic lives in one place. We map calendar weeks to personas and style knobs in the prompt builder. The API takes three card names, the current week, and optional context, then calls Claude to produce the reading. Safety rails are baked in — no medical or legal advice, no prophecy, always agency and consent-forward language. The UI renders Markdown, and journals can stay local by default. The result is a tight loop with clear boundaries and an evolving voice.

[2:25–3:20] The Story Mode pivot (minimal change, big effect)

Now the fun part: with almost no UI changes, we can flip from “reflective reading” to “micro‑story.” Two paths: today, we can hint it through intention — “Story mode: short scene, second‑person, let the cards shape setting and a gentle turn.” Or, as a tiny backend tweak, add a `storyMode` flag in the prompt builder. Same three cards, same flow, but the output becomes a daily scene: opener, three card‑anchored beats, soft landing. Safety rails remain; tone follows the persona arc. In other words: one app, many voices. The plan is documented and staged, so we can roll it out behind a flag and iterate.

[3:20–3:45] Close

Arcana today is a gentle daily practice. Tomorrow, it can be a serialized micro‑fiction engine — simply by changing how the Oracle speaks. Reflective now, narrative next. Thanks for watching.

---

Director’s cues (not read)

- Title card: logo + one‑liner.
- Tour: draw → reading → journal, minimal mouse movement.
- Stages: three browser profiles — Week 1 vs ~20 vs ~49.
- Code peek: `lib/oracle.ts` personas and prompt blocks; `app/api/oracle/route.ts` showing model + temperature.
- Story Mode: scroll `dev-docs/story-mode-implementation-plan.md`; optionally show `/test-oracle` with a story intention.
- End: journal close + countdown to next day.


