export interface TarotCard {
  id: string
  name: string
  arcana: 'major' | 'minor'
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles'
  keywords: string[]
  meaning: string
  symbolism: string
  question: string
}

const MAJOR_CARDS: TarotCard[] = [
  // Major Arcana - The 22 primary cards
  {
    id: 'fool',
    name: 'The Fool',
    arcana: 'major',
    keywords: ['new beginnings', 'innocence', 'adventure', 'leap of faith'],
    meaning: 'A fresh start awaits. Embrace the unknown with childlike wonder and trust in the journey ahead.',
    symbolism: 'The cliff edge represents the leap of faith we all must take into the unknown.',
    question: 'What new adventure is calling to your soul?'
  },
  {
    id: 'magician',
    name: 'The Magician',
    arcana: 'major',
    keywords: ['manifestation', 'willpower', 'skill', 'concentration'],
    meaning: 'You have all the tools you need. Focus your intention and make your vision reality.',
    symbolism: 'The infinity symbol represents unlimited potential channeled through focused will.',
    question: 'What power do you possess that you have not yet fully realized?'
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    arcana: 'major',
    keywords: ['intuition', 'inner wisdom', 'mystery', 'subconscious'],
    meaning: 'Trust your inner knowing. The answers you seek lie within, beyond the veil of conscious thought.',
    symbolism: 'The veil behind her represents the thin barrier between conscious and unconscious wisdom.',
    question: 'What is your intuition trying to tell you?'
  },
  {
    id: 'empress',
    name: 'The Empress',
    arcana: 'major',
    keywords: ['abundance', 'creativity', 'nurturing', 'fertility'],
    meaning: 'Creative energy flows through you. Nurture your ideas and watch them flourish into abundance.',
    symbolism: 'The wheat field represents the fruits of patient cultivation and care.',
    question: 'What are you ready to bring into being?'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    arcana: 'major',
    keywords: ['authority', 'structure', 'stability', 'leadership'],
    meaning: 'Establish order and take command. Your strength lies in creating stable foundations.',
    symbolism: 'The throne represents the power that comes from discipline and structure.',
    question: 'Where in your life do you need to take charge?'
  },
  {
    id: 'hierophant',
    name: 'The Hierophant',
    arcana: 'major',
    keywords: ['tradition', 'spiritual guidance', 'conformity', 'education'],
    meaning: 'Seek wisdom from established traditions. Sometimes the old ways illuminate new paths.',
    symbolism: 'The keys represent access to hidden knowledge through traditional wisdom.',
    question: 'What teachings from the past can guide you forward?'
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    arcana: 'major',
    keywords: ['choice', 'partnership', 'harmony', 'values'],
    meaning: 'A significant choice approaches. Consider what truly aligns with your deepest values.',
    symbolism: 'The angel represents divine guidance in matters of the heart and choice.',
    question: 'What choice is your heart asking you to make?'
  },
  {
    id: 'chariot',
    name: 'The Chariot',
    arcana: 'major',
    keywords: ['willpower', 'determination', 'victory', 'control'],
    meaning: 'Victory comes through focused determination. Harness opposing forces and drive forward.',
    symbolism: 'The black and white sphinxes represent opposing forces brought into harmony.',
    question: 'What inner conflicts need your focused attention?'
  },
  {
    id: 'strength',
    name: 'Strength',
    arcana: 'major',
    keywords: ['inner courage', 'compassion', 'patience', 'gentle power'],
    meaning: 'True strength comes from within. Gentle persistence overcomes the greatest obstacles.',
    symbolism: 'The woman taming the lion shows compassion conquering force.',
    question: 'Where can you apply gentle strength instead of force?'
  },
  {
    id: 'hermit',
    name: 'The Hermit',
    arcana: 'major',
    keywords: ['soul searching', 'inner guidance', 'solitude', 'wisdom'],
    meaning: 'Turn inward for answers. The wisdom you seek can only be found in quiet contemplation.',
    symbolism: 'The lantern represents the inner light that guides us through darkness.',
    question: 'What truth are you ready to illuminate within yourself?'
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    arcana: 'major',
    keywords: ['cycles', 'change', 'fate', 'opportunity'],
    meaning: 'The wheel turns and change arrives. Embrace the cycles of life with faith and adaptability.',
    symbolism: 'The wheel represents the eternal cycles of fortune and change.',
    question: 'How can you flow with the changes coming your way?'
  },
  {
    id: 'justice',
    name: 'Justice',
    arcana: 'major',
    keywords: ['balance', 'fairness', 'truth', 'accountability'],
    meaning: 'Seek balance and truth in all things. Your actions create consequences that return to you.',
    symbolism: 'The scales represent the delicate balance of cause and effect.',
    question: 'Where do you need to restore balance in your life?'
  },
  {
    id: 'hanged-man',
    name: 'The Hanged Man',
    arcana: 'major',
    keywords: ['suspension', 'sacrifice', 'new perspective', 'letting go'],
    meaning: 'Sometimes we must pause and surrender to gain a new perspective on our situation.',
    symbolism: 'The inverted position represents seeing things from a completely different angle.',
    question: 'What would you see if you looked at this situation upside down?'
  },
  {
    id: 'death',
    name: 'Death',
    arcana: 'major',
    keywords: ['transformation', 'endings', 'rebirth', 'change'],
    meaning: 'An ending makes way for a new beginning. Transformation requires releasing what no longer serves.',
    symbolism: 'The sunrise in the background shows that every ending contains a new dawn.',
    question: 'What are you ready to transform or release?'
  },
  {
    id: 'temperance',
    name: 'Temperance',
    arcana: 'major',
    keywords: ['balance', 'moderation', 'patience', 'harmony'],
    meaning: 'Find the middle path. Balance opposing forces through patience and careful consideration.',
    symbolism: 'The flowing water represents the harmonious blending of different elements.',
    question: 'What aspects of your life need more balance?'
  },
  {
    id: 'devil',
    name: 'The Devil',
    arcana: 'major',
    keywords: ['bondage', 'materialism', 'temptation', 'illusion'],
    meaning: 'Examine what binds you. Often our chains are of our own making and can be removed.',
    symbolism: 'The loose chains show that bondage is often an illusion we can choose to break.',
    question: 'What illusions or habits are keeping you bound?'
  },
  {
    id: 'tower',
    name: 'The Tower',
    arcana: 'major',
    keywords: ['sudden change', 'revelation', 'awakening', 'liberation'],
    meaning: 'Old structures crumble to make way for truth. Sudden change brings unexpected liberation.',
    symbolism: 'Lightning represents sudden illumination that destroys false foundations.',
    question: 'What false foundations in your life are ready to fall?'
  },
  {
    id: 'star',
    name: 'The Star',
    arcana: 'major',
    keywords: ['hope', 'inspiration', 'healing', 'guidance'],
    meaning: 'Hope returns after difficulty. Trust in the guidance that comes from your highest aspirations.',
    symbolism: 'The seven stars represent chakras and the guidance available from higher consciousness.',
    question: 'What inspires you and gives you hope?'
  },
  {
    id: 'moon',
    name: 'The Moon',
    arcana: 'major',
    keywords: ['illusion', 'intuition', 'mystery', 'subconscious'],
    meaning: 'Not everything is as it seems. Trust your intuition to navigate through uncertainty.',
    symbolism: 'The path between the towers represents the journey through the unknown.',
    question: 'What hidden truths is your intuition revealing?'
  },
  {
    id: 'sun',
    name: 'The Sun',
    arcana: 'major',
    keywords: ['joy', 'success', 'vitality', 'clarity'],
    meaning: 'Joy and success illuminate your path. Embrace the warmth of achievement and happiness.',
    symbolism: 'The sunflowers represent growth toward the light and life-giving energy.',
    question: 'What brings you genuine joy and vitality?'
  },
  {
    id: 'judgement',
    name: 'Judgement',
    arcana: 'major',
    keywords: ['rebirth', 'awakening', 'calling', 'forgiveness'],
    meaning: 'A calling awakens within you. Past experiences transform into wisdom for your new beginning.',
    symbolism: 'The angel\'s trumpet represents the call to spiritual awakening and renewal.',
    question: 'What is your soul calling you to awaken to?'
  },
  {
    id: 'world',
    name: 'The World',
    arcana: 'major',
    keywords: ['completion', 'achievement', 'fulfillment', 'wholeness'],
    meaning: 'A cycle completes with achievement and fulfillment. You have integrated all aspects of your journey.',
    symbolism: 'The wreath represents the eternal cycle of completion and new beginnings.',
    question: 'What achievement or completion are you ready to celebrate?'
  }
]

// Minor Arcana generator
const SUITS = [
  {
    id: 'cups' as const,
    name: 'Cups',
    domain: 'emotions, relationships, intuition',
    symbolism: 'Cups represent the realm of feeling, connection, and the heart.',
    keywords: ['feelings', 'relationships', 'intuition', 'flow']
  },
  {
    id: 'wands' as const,
    name: 'Wands',
    domain: 'creativity, action, will',
    symbolism: 'Wands signify passion, initiative, and the spark of creation.',
    keywords: ['creativity', 'action', 'inspiration', 'drive']
  },
  {
    id: 'swords' as const,
    name: 'Swords',
    domain: 'thought, truth, conflict',
    symbolism: 'Swords cut through illusion with clarity—and sometimes friction.',
    keywords: ['thought', 'clarity', 'truth', 'conflict']
  },
  {
    id: 'pentacles' as const,
    name: 'Pentacles',
    domain: 'work, body, resources',
    symbolism: 'Pentacles ground ideas into the physical and practical world.',
    keywords: ['practicality', 'resources', 'health', 'work']
  }
]

type RankId =
  | 'ace' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'nine' | 'ten'
  | 'page' | 'knight' | 'queen' | 'king'

const RANKS: Array<{
  id: RankId
  name: string
  keywords: string[]
  meaning: string
  question: string
  symbolism: string
}> = [
  { id: 'ace', name: 'Ace', keywords: ['beginnings', 'pure potential', 'seed'], meaning: 'A fresh beginning arises in the domain of SUIT_DOMAIN.', symbolism: 'A single emblem signals pure, undivided potential.', question: 'What new beginning are you ready to welcome here?' },
  { id: 'two', name: 'Two', keywords: ['duality', 'choice', 'balance'], meaning: 'A choice or balance point emerges in SUIT_DOMAIN.', symbolism: 'Two symbols mirror the tension and harmony of duality.', question: 'Where do you need balance or partnership now?' },
  { id: 'three', name: 'Three', keywords: ['growth', 'collaboration', 'initial results'], meaning: 'Early growth appears through cooperation in SUIT_DOMAIN.', symbolism: 'A triad indicates expansion through connection.', question: 'Who or what supports this early growth?' },
  { id: 'four', name: 'Four', keywords: ['stability', 'structure', 'plateau'], meaning: 'Stability holds—perhaps too tightly—within SUIT_DOMAIN.', symbolism: 'A square foundation offers rest and containment.', question: 'Where has comfort become stagnation?' },
  { id: 'five', name: 'Five', keywords: ['challenge', 'loss', 'recalibration'], meaning: 'A challenge invites adjustment in SUIT_DOMAIN.', symbolism: 'Disruption breaks old patterns to reveal truth.', question: 'What can be learned from this friction?' },
  { id: 'six', name: 'Six', keywords: ['recovery', 'support', 'exchange'], meaning: 'Relief, generosity, or helpful movement enters SUIT_DOMAIN.', symbolism: 'A gentle current carries you forward.', question: 'What support can you give or receive now?' },
  { id: 'seven', name: 'Seven', keywords: ['assessment', 'strategy', 'patience'], meaning: 'Pause and reassess your approach within SUIT_DOMAIN.', symbolism: 'A pause between sowing and harvest.', question: 'What strategy needs refinement?' },
  { id: 'eight', name: 'Eight', keywords: ['skill', 'progress', 'dedication'], meaning: 'Sustained effort builds mastery in SUIT_DOMAIN.', symbolism: 'Repetition forges skill and endurance.', question: 'Where is disciplined practice asking for your time?' },
  { id: 'nine', name: 'Nine', keywords: ['nearing fulfillment', 'resilience', 'intensity'], meaning: 'Approaching completion brings intensity in SUIT_DOMAIN.', symbolism: 'The penultimate step tests resolve.', question: 'What boundary or mindset sustains you now?' },
  { id: 'ten', name: 'Ten', keywords: ['completion', 'culmination', 'legacy'], meaning: 'A cycle completes with tangible outcomes in SUIT_DOMAIN.', symbolism: 'A full set marks closure and inheritance.', question: 'What completes—and what begins because of it?' },
  { id: 'page', name: 'Page', keywords: ['curiosity', 'learning', 'messages'], meaning: 'Beginner’s mind explores SUIT_DOMAIN with openness.', symbolism: 'A youthful messenger invites discovery.', question: 'What can you learn if you approach this as new?' },
  { id: 'knight', name: 'Knight', keywords: ['pursuit', 'movement', 'commitment'], meaning: 'Focused pursuit drives momentum in SUIT_DOMAIN.', symbolism: 'Armor and motion symbolize a chosen quest.', question: 'What commitment deserves decisive action?' },
  { id: 'queen', name: 'Queen', keywords: ['mastery', 'care', 'embodiment'], meaning: 'Inner mastery and stewardship shape SUIT_DOMAIN.', symbolism: 'A throne of receptive power nurtures outcomes.', question: 'How can you steward this with care and wisdom?' },
  { id: 'king', name: 'King', keywords: ['authority', 'responsibility', 'vision'], meaning: 'Clear leadership brings order to SUIT_DOMAIN.', symbolism: 'Crown and realm signal accountable direction.', question: 'What structure or decision will serve the whole?' }
]

function generateMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const id = `${rank.id}-of-${suit.id}`
      const name = `${rank.name} of ${suit.name}`
      const keywords = Array.from(new Set([...rank.keywords, ...suit.keywords])).slice(0, 4)
      const meaning = rank.meaning.replace('SUIT_DOMAIN', suit.domain)
      const symbolism = `${rank.symbolism} ${suit.symbolism}`
      const question = rank.question
      cards.push({
        id,
        name,
        arcana: 'minor',
        suit: suit.id,
        keywords,
        meaning,
        symbolism,
        question
      })
    }
  }
  return cards
}

const MINOR_CARDS: TarotCard[] = generateMinorArcana()

export const CARDS: TarotCard[] = [...MAJOR_CARDS, ...MINOR_CARDS]

// API integration (tarotapi.dev)
const TAROT_API_BASE = 'https://tarotapi.dev/api/v1'

type ApiCard = {
  name: string
  type?: string
  suit?: string | null
  desc?: string | null
  meaning_up?: string | null
  meaning_rev?: string | null
}

let apiDeckCache: TarotCard[] | null = null
let apiDeckFetchedAt = 0
const API_DECK_TTL_MS = 24 * 60 * 60 * 1000

function slugifyNameToId(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return base.startsWith('the-') ? base.replace(/^the-/, '') : base
}

function parseMinorRank(name?: string): { rank?: RankId, isCourt?: boolean } {
  if (!name) return {}
  const lower = name.toLowerCase()
  const rankMap: Array<{ id: RankId, re: RegExp, court?: boolean }> = [
    { id: 'ace', re: /^ace\b/ },
    { id: 'two', re: /^two\b/ },
    { id: 'three', re: /^three\b/ },
    { id: 'four', re: /^four\b/ },
    { id: 'five', re: /^five\b/ },
    { id: 'six', re: /^six\b/ },
    { id: 'seven', re: /^seven\b/ },
    { id: 'eight', re: /^eight\b/ },
    { id: 'nine', re: /^nine\b/ },
    { id: 'ten', re: /^ten\b/ },
    { id: 'page', re: /^page\b/, court: true },
    { id: 'knight', re: /^knight\b/, court: true },
    { id: 'queen', re: /^queen\b/, court: true },
    { id: 'king', re: /^king\b/, court: true }
  ]
  const found = rankMap.find(r => r.re.test(lower))
  if (!found) return {}
  return { rank: found.id, isCourt: !!found.court }
}

function deriveKeywords(arcana: 'major' | 'minor', suit?: TarotCard['suit'] | null, name?: string): string[] {
  if (arcana === 'major') return ['archetype', 'shift', 'lesson', 'pattern']
  const s = suit ?? undefined
  const base = s === 'cups'
    ? ['feelings', 'relationships', 'intuition', 'flow']
    : s === 'wands'
    ? ['creativity', 'action', 'inspiration', 'drive']
    : s === 'swords'
    ? ['thought', 'clarity', 'truth', 'conflict']
    : s === 'pentacles'
    ? ['practicality', 'resources', 'health', 'work']
    : ['insight', 'reflection', 'choice', 'movement']

  const { rank } = parseMinorRank(name)
  const rankExtras: Partial<Record<RankId, string[]>> = {
    ace: ['seed', 'spark'],
    two: ['duality', 'options'],
    three: ['planning', 'support'],
    four: ['stability', 'plateau'],
    five: ['challenge', 'shift'],
    six: ['recovery', 'exchange'],
    seven: ['assessment', 'patience'],
    eight: ['practice', 'discipline'],
    nine: ['resilience', 'threshold'],
    ten: ['completion', 'legacy'],
    page: ['curiosity', 'learning'],
    knight: ['pursuit', 'momentum'],
    queen: ['stewardship', 'embodiment'],
    king: ['authority', 'responsibility']
  }
  const extras = rank ? (rankExtras[rank] ?? []) : []
  return Array.from(new Set([...base, ...extras])).slice(0, 6)
}

function deriveQuestion(arcana: 'major' | 'minor', suit?: TarotCard['suit'] | null, name?: string): string {
  if (arcana === 'major') return 'What larger pattern or invitation is emerging for you?'
  const { rank, isCourt } = parseMinorRank(name)
  if (isCourt) {
    if (rank === 'page') return 'What can you learn if you approach this as new?'
    if (rank === 'knight') return 'What commitment deserves decisive action?'
    if (rank === 'queen') return 'How can you steward this with care and wisdom?'
    if (rank === 'king') return 'What structure or decision will serve the whole?'
  }
  if (suit === 'cups') return rank === 'five' ? 'What feeling of loss wants tending?' : 'What feeling wants acknowledgment now?'
  if (suit === 'wands') return rank === 'three' ? 'What plan wants bold follow-through?' : 'Where is your energy asking to be directed?'
  if (suit === 'swords') return rank === 'seven' ? 'Where is strategy preferable to force?' : 'What truth needs clear, honest language?'
  if (suit === 'pentacles') return rank === 'eight' ? 'Where is disciplined practice needed?' : 'What practical step would ground this?'
  return 'What wants attention in this moment?'
}

function mapApiCardToTarot(api: ApiCard): TarotCard {
  const arcana: 'major' | 'minor' = (api.type?.toLowerCase() === 'major') ? 'major' : 'minor'
  const suit = (api.suit ? api.suit.toLowerCase() : undefined) as TarotCard['suit'] | undefined
  const id = slugifyNameToId(api.name)
  return {
    id,
    name: api.name,
    arcana,
    suit,
    keywords: deriveKeywords(arcana, suit, api.name),
    meaning: api.meaning_up || api.desc || 'A card inviting reflection and honest appraisal.',
    symbolism: api.desc || (suit ? `${suit} reflects its elemental domain.` : 'An archetype speaking through symbol and story.'),
    question: deriveQuestion(arcana, suit, api.name)
  }
}

const nameToCardCache = new Map<string, TarotCard>()

async function fetchApiDeck(): Promise<TarotCard[]> {
  try {
    const now = Date.now()
    if (apiDeckCache && (now - apiDeckFetchedAt) < API_DECK_TTL_MS) return apiDeckCache
    const res = await fetch(`${TAROT_API_BASE}/cards`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Tarot API error: ${res.status}`)
    const data = await res.json() as { cards?: ApiCard[] } | ApiCard[]
    const rawCards: ApiCard[] = Array.isArray(data) ? data : (data.cards ?? [])
    const deck = rawCards.map(mapApiCardToTarot)
    // Some APIs may omit reversed duplicates; ensure uniqueness by id
    const uniqueById = new Map(deck.map(c => [c.id, c]))
    apiDeckCache = Array.from(uniqueById.values())
    apiDeckFetchedAt = now
    nameToCardCache.clear()
    for (const c of apiDeckCache) nameToCardCache.set(c.name.toLowerCase(), c)
    return apiDeckCache
  } catch (_) {
    // Fallback to local deck
    nameToCardCache.clear()
    for (const c of CARDS) nameToCardCache.set(c.name.toLowerCase(), c)
    return CARDS
  }
}

export async function getDeck(preferApi: boolean = true): Promise<TarotCard[]> {
  return preferApi ? fetchApiDeck() : CARDS
}

export async function drawThreeCardsAsync(): Promise<TarotCard[]> {
  const deck = await getDeck(true)
  const shuffled = [...deck].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export async function getCardByIdAsync(id: string): Promise<TarotCard | undefined> {
  const deck = await getDeck(true)
  const found = deck.find(card => card.id === id)
  if (found) return found
  return CARDS.find(card => card.id === id)
}

export async function searchCardsAsync(query: string): Promise<TarotCard[]> {
  const deck = await getDeck(true)
  const lowercaseQuery = query.toLowerCase()
  return deck.filter(card => 
    card.name.toLowerCase().includes(lowercaseQuery) ||
    card.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
    card.meaning.toLowerCase().includes(lowercaseQuery)
  )
}

export async function getMeaningLineForName(cardName: string, position?: 'PAST' | 'PRESENT' | 'POTENTIAL'): Promise<string> {
  const cacheKey = `${position ?? 'NA'}|${cardName.toLowerCase()}`
  const now = Date.now()
  const cached = meaningLineCache.get(cacheKey)
  if (cached && (now - cached.ts) < MEANING_CACHE_TTL_MS) return cached.value

  if (nameToCardCache.size === 0) {
    const deck = await getDeck(true)
    for (const c of deck) nameToCardCache.set(c.name.toLowerCase(), c)
  }
  const card = nameToCardCache.get(cardName.toLowerCase())
  const base = card ? `${card.name}: ${card.meaning}` : `${cardName}: A card of reflection inviting clarity.`
  const value = position ? `${position} - ${base}` : base
  meaningLineCache.set(cacheKey, { value, ts: now })
  return value
}

const MEANING_CACHE_TTL_MS = 6 * 60 * 60 * 1000
const meaningLineCache = new Map<string, { value: string, ts: number }>()

// Utility functions
export function drawThreeCards(): TarotCard[] {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export function getCardById(id: string): TarotCard | undefined {
  return CARDS.find(card => card.id === id)
}

export function getRandomCard(): TarotCard {
  return CARDS[Math.floor(Math.random() * CARDS.length)]
}

// Spread definitions
export const SPREADS = {
  past_present_potential: {
    name: 'Past / Present / Potential',
    positions: ['Past', 'Present', 'Potential'],
    description: 'A gentle reflection on where you\'ve been, where you are, and where you might be going.',
    cards: 3
  },
  crossroads: {
    name: 'Crossroads',
    positions: ['Current Path', 'Option A', 'Option B', 'Hidden Cost'],
    description: 'When facing a significant decision, illuminate the paths before you.',
    cards: 4
  },
  mirror: {
    name: 'Mirror',
    positions: ['How I See Myself', 'How Others See Me', 'Hidden Truth'],
    description: 'Reflect on the relationship between self-perception and external reality.',
    cards: 3
  }
}

// Card filtering and searching
export function getCardsByArcana(arcana: 'major' | 'minor'): TarotCard[] {
  return CARDS.filter(card => card.arcana === arcana)
}

export function searchCards(query: string): TarotCard[] {
  const lowercaseQuery = query.toLowerCase()
  return CARDS.filter(card => 
    card.name.toLowerCase().includes(lowercaseQuery) ||
    card.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
    card.meaning.toLowerCase().includes(lowercaseQuery)
  )
}
