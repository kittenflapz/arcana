/*
  Tarot SVG generator using Anthropic.
  - Reads card data from ../lib/tarot
  - Generates SVGs into ../public/cards/{id}.svg
  - Supports --pilots or --all, with retries and basic validation
*/

import Anthropic from '@anthropic-ai/sdk'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

import { CARDS, type TarotCard } from '../lib/tarot'

type RunMode = 'pilots' | 'all'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public', 'cards')
const tmpDir = path.join(projectRoot, 'tmp')
const logPath = path.join(tmpDir, 'svg-gen-log.jsonl')

const PILOT_IDS = new Set<string>([
  'fool',
  'tower',
  'two-of-cups',
  'seven-of-swords',
  'queen-of-pentacles',
])

function ensureDirs() {
  fs.mkdirSync(publicDir, { recursive: true })
  fs.mkdirSync(tmpDir, { recursive: true })
}

function naiveLoadEnv() {
  // Try to load .env.local or .env at repo root without adding deps
  const candidates = [
    path.join(projectRoot, '.env.local'),
    path.join(projectRoot, '.env'),
    path.join(projectRoot, '..', '.env.local'),
    path.join(projectRoot, '..', '.env'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const text = fs.readFileSync(p, 'utf8')
      for (const line of text.split(/\r?\n/)) {
        const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (!match) continue
        const key = match[1]
        let value = match[2]
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
          value = value.slice(1, -1)
        }
        if (!(key in process.env)) process.env[key] = value
      }
    }
  }
}

function parseArgs(): RunMode {
  const args = process.argv.slice(2)
  if (args.includes('--pilots')) return 'pilots'
  if (args.includes('--all')) return 'all'
  return 'pilots'
}

function chooseCards(mode: RunMode): TarotCard[] {
  if (mode === 'all') return CARDS
  return CARDS.filter(c => PILOT_IDS.has(c.id))
}

function accentFor(card: TarotCard): { majors: boolean; accentHex: string } {
  if (card.arcana === 'major') return { majors: true, accentHex: '#7a5cff' }
  const suitAccent: Record<NonNullable<TarotCard['suit']>, string> = {
    cups: '#4a90e2',
    wands: '#e06a2b',
    swords: '#7f8c99',
    pentacles: '#3aa374',
  }
  return { majors: false, accentHex: suitAccent[card.suit ?? 'cups'] }
}

function buildSystemPrompt(): string {
  return [
    'You are a meticulous SVG illustrator. Output a single, valid, self-contained SVG. Do not include explanations.',
    'Style: intricate sacred-geometry line art with flowing curves and filigree; portrait 700×1200; cream background; near-black strokes; 1–2 accent colors per suit/arcana; framed border with ornamental corners; central emblem + 1–2 symbolic motifs; no text.',
    'Technique: prefer <path> with cubic Bezier curves (commands C or S), occasional quadratics (Q) and arcs (A); layered groups; varied stroke widths; gentle radial/linear gradients okay; small pattern fills allowed.',
    'Constraints: no external images or fonts; no script; ids must be prefixed with the provided card id; aim for ≤ 120 KB; keep shapes smooth and purposeful.',
    'Output: ONLY the <svg>...</svg> element.',
  ].join('\n')
}

function buildUserPrompt(card: TarotCard): string {
  const { majors, accentHex } = accentFor(card)
  const palette = [
    'base lines: #0f0f11 on background: #f7f4ef',
    `accent: ${majors ? '#7a5cff and/or #f0c34a' : accentHex}`,
  ].join('\n')

  // Keep meaning short-ish to control tokens
  const meaning = card.meaning.length > 220 ? card.meaning.slice(0, 217) + '…' : card.meaning

  return [
    `card_id: ${card.id}`,
    `card_name: ${card.name}`,
    `arcana: ${card.arcana}`,
    `suit: ${card.suit ?? 'none'}`,
    `keywords: ${card.keywords.join(', ')}`,
    `meaning: ${meaning}`,
    `symbolism_hints: ${card.symbolism}`,
    '',
    'Task: Create a cohesive, ornate SVG illustration following the style guide. Use this palette:',
    palette,
    '',
    'Composition: framed ornamental border with curved corner motifs; central emblem with flowing curved silhouettes; 1–2 smaller motifs from hints; subtle circular/triangular geometry grid; no text.',
    'Complexity: include at least 10 <path> elements; use cubic Bezier curves (C or S) in multiple paths; include at least one arc (A) or quadratic (Q); vary stroke widths for depth.',
    `Ids: prefix all defs and element ids with ${card.id}-`,
  ].join('\n')
}

function isValidSvg(svg: string): boolean {
  if (!svg.includes('<svg')) return false
  if (!/viewBox\s*=\s*"0\s+0\s+700\s+1200"/.test(svg)) return false
  if (/<script\b/i.test(svg)) return false
  if (/<image\b/i.test(svg)) return false
  // Encourage curves and sufficient detail
  const pathCount = (svg.match(/<path\b/gi) || []).length
  const hasCurves = /d\s*=\s*"[^"]*[CSQAscqa][^"]*"/.test(svg)
  if (pathCount < 8) return false
  if (!hasCurves) return false
  return true
}

async function generateOne(anthropic: Anthropic, card: TarotCard): Promise<{ ok: boolean; path?: string; error?: string; tokens?: number }> {
  const outPath = path.join(publicDir, `${card.id}.svg`)
  const system = buildSystemPrompt()
  const user = buildUserPrompt(card)
  try {
    const resp = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 5000,
      temperature: 0.18,
      system,
      messages: [{ role: 'user', content: user }],
    })
    const part = resp.content[0]
    const text = part && part.type === 'text' ? part.text : ''
    if (!isValidSvg(text)) {
      return { ok: false, error: 'invalid-svg' }
    }
    fs.writeFileSync(outPath, text, 'utf8')
    return { ok: true, path: outPath, tokens: (resp.usage?.output_tokens ?? 0) + (resp.usage?.input_tokens ?? 0) }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) }
  }
}

function log(line: any) {
  const rec = { ts: new Date().toISOString(), ...line }
  fs.appendFileSync(logPath, JSON.stringify(rec) + '\n', 'utf8')
}

async function run() {
  naiveLoadEnv()
  ensureDirs()

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY in environment or .env.local/.env')
    process.exitCode = 1
    return
  }
  const anthropic = new Anthropic({ apiKey })

  const mode = parseArgs()
  const cards = chooseCards(mode)
  console.log(`Generating ${cards.length} SVG(s) → ${publicDir}`)

  let success = 0
  for (const card of cards) {
    const target = path.join(publicDir, `${card.id}.svg`)
    if (fs.existsSync(target) && !process.argv.includes('--overwrite')) {
      console.log(`skip ${card.id} (exists)`) 
      log({ id: card.id, status: 'skip-exists', path: target })
      success++
      continue
    }
    let attempt = 0
    let lastErr: string | undefined
    while (attempt < 3) {
      attempt++
      console.log(`gen ${card.id} (attempt ${attempt})`)
      const res = await generateOne(anthropic, card)
      if (res.ok) {
        console.log(`ok  ${card.id}`)
        log({ id: card.id, status: 'ok', path: res.path, tokens: res.tokens })
        success++
        break
      } else {
        lastErr = res.error
        log({ id: card.id, status: 'error', error: res.error })
        // backoff
        await new Promise(r => setTimeout(r, 300 * attempt))
      }
    }
    if (attempt >= 3 && lastErr) {
      console.warn(`fail ${card.id}: ${lastErr}`)
    }
  }

  console.log(`Done. ${success}/${cards.length} succeeded.`)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})


