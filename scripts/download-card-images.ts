/*
  Download all tarot images from krates98/tarotcardapi into public/cards.
  - Lists images via GitHub Contents API
  - Maps filenames to our TarotCard ids with normalization + synonyms
  - Writes as public/cards/{id}.{ext}
  - Logs missing mappings to tmp/image-missing.json
*/

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { CARDS, type TarotCard } from '../lib/tarot'

type GithubContentItem = {
  name: string
  path: string
  download_url: string | null
  type: 'file' | 'dir'
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicCardsDir = path.join(projectRoot, 'public', 'cards')
const tmpDir = path.join(projectRoot, 'tmp')
const missingPath = path.join(tmpDir, 'image-missing.json')
const logPath = path.join(tmpDir, 'image-download-log.jsonl')

function ensureDirs() {
  fs.mkdirSync(publicCardsDir, { recursive: true })
  fs.mkdirSync(tmpDir, { recursive: true })
}

function normalizeStem(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function fileStem(fileName: string): string {
  return normalizeStem(fileName.replace(/\.[a-zA-Z0-9]+$/, ''))
}

function idToCandidates(id: string, card?: TarotCard): string[] {
  const base = id
  const variants = new Set<string>()
  const add = (v: string) => variants.add(normalizeStem(v))

  add(base)
  add(base.replace(/^the-/, ''))
  add(base.startsWith('the-') ? base : `the-${base}`)
  add(base.replace(/-of-/, ' of '))
  add(base.replace(/-/g, ' '))

  // Suit synonyms for minors
  if (card?.arcana === 'minor' && card.suit) {
    const suit = card.suit
    const suitSynonyms: Record<string, string[]> = {
      pentacles: ['coins'],
      wands: ['rods', 'batons', 'staves'],
      cups: ['chalices'],
      swords: ['blades']
    }
    const syns = suitSynonyms[suit] || []
    for (const syn of syns) {
      add(base.replace('pentacles', syn))
      add(base.replace('wands', syn))
      add(base.replace('cups', syn))
      add(base.replace('swords', syn))
    }
  }

  // Major synonyms
  const majorSynonyms: Array<[RegExp, string]> = [
    [/^strength$/, 'fortitude'],
    [/^judgement$/, 'judgment'],
    [/^high-priestess$/, 'priestess'],
  ]
  for (const [re, rep] of majorSynonyms) {
    if (re.test(base)) {
      add(base.replace(re, rep))
      add(base.replace(re, `the-${rep}`))
    }
  }

  return Array.from(variants)
}

function chooseExt(name: string): string {
  const m = name.match(/\.([a-zA-Z0-9]+)$/)
  const ext = (m ? m[1].toLowerCase() : 'jpg')
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return ext
  return 'jpg'
}

function log(line: unknown) {
  fs.appendFileSync(logPath, JSON.stringify({ ts: new Date().toISOString(), ...line as any }) + '\n', 'utf8')
}

async function main() {
  ensureDirs()

  const res = await fetch('https://api.github.com/repos/krates98/tarotcardapi/contents/images', {
    headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : undefined,
    cache: 'no-store'
  })
  if (!res.ok) throw new Error(`GitHub contents error ${res.status}`)
  const data = await res.json() as GithubContentItem[]
  const files = (data || []).filter(it => it.type === 'file' && !!it.download_url)

  // Build index by normalized stem
  const stemToItem = new Map<string, GithubContentItem>()
  for (const item of files) {
    stemToItem.set(fileStem(item.name), item)
  }

  const missing: Array<{ id: string, name: string, candidates: string[] }> = []
  let ok = 0

  for (const card of CARDS) {
    const candidates = idToCandidates(card.id, card)
    let item: GithubContentItem | undefined
    // exact stem match
    for (const c of candidates) {
      const found = stemToItem.get(c)
      if (found) { item = found; break }
    }
    // includes fallback
    if (!item) {
      for (const [stem, f] of stemToItem) {
        if (candidates.some(c => stem.includes(c))) { item = f; break }
      }
    }

    if (!item) {
      missing.push({ id: card.id, name: card.name, candidates })
      log({ id: card.id, status: 'missing' })
      continue
    }

    const ext = chooseExt(item.name)
    const target = path.join(publicCardsDir, `${card.id}.${ext}`)
    if (fs.existsSync(target) && !process.argv.includes('--overwrite')) {
      log({ id: card.id, status: 'skip-exists', path: target })
      ok++
      continue
    }
    try {
      const imgRes = await fetch(item.download_url as string)
      if (!imgRes.ok) throw new Error(`download ${imgRes.status}`)
      const buf = Buffer.from(await imgRes.arrayBuffer())
      fs.writeFileSync(target, buf)
      log({ id: card.id, status: 'ok', path: target, bytes: buf.byteLength })
      ok++
    } catch (err: any) {
      log({ id: card.id, status: 'error', error: err?.message || String(err) })
    }
  }

  if (missing.length) {
    fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2))
  }

  console.log(`Downloaded/ready: ${ok}/${CARDS.length}. Missing: ${missing.length}.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})


