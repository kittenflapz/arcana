// Oracle persona system: acts, personas, style knobs, and prompt builder
import { getMeaningLineForName } from './tarot'

export type Act = 'veil' | 'echoes' | 'fracture' | 'pilgrimage' | 'release'

export type OraclePersona =
  | 'confident_mystical'
  | 'pattern_recognizing'
  | 'questioning_self'
  | 'vulnerable_humble'
  | 'compassionate_mirror'

export interface StyleKnobs {
  tone: string
  metaphorDensity: 'low' | 'medium' | 'high'
  asideFrequency: 'none' | 'rare' | 'occasional'
  directness: 'low' | 'medium' | 'high'
  humility: 'low' | 'medium' | 'high'
  questionCount: 1 | 2 | 3
  temperature: number
}

export interface PersonaSnapshot {
  weekNumber: number
  act: Act
  persona: OraclePersona
  style: StyleKnobs
}

export function getActForWeek(weekNumber: number): Act {
  if (weekNumber <= 4) return 'veil'
  if (weekNumber <= 17) return 'echoes'
  if (weekNumber <= 34) return 'fracture'
  if (weekNumber <= 47) return 'pilgrimage'
  return 'release'
}

export function getPersonaForWeek(weekNumber: number): OraclePersona {
  const act = getActForWeek(weekNumber)
  switch (act) {
    case 'veil':
      return 'confident_mystical'
    case 'echoes':
      return 'pattern_recognizing'
    case 'fracture':
      return 'questioning_self'
    case 'pilgrimage':
      return 'vulnerable_humble'
    case 'release':
    default:
      return 'compassionate_mirror'
  }
}

export function getPersonaDescription(persona: OraclePersona): string {
  const descriptions: Record<OraclePersona, string> = {
    confident_mystical: 'Confident and mystical, speaking with ancient wisdom',
    pattern_recognizing: 'Thoughtful and observant, beginning to notice patterns',
    questioning_self: 'Increasingly self-aware, admitting uncertainty',
    vulnerable_humble: 'Vulnerable and humble, showing genuine uncertainty',
    compassionate_mirror: 'Honest and compassionate, embracing role as reflection tool',
  }
  return descriptions[persona]
}

export function getStyleForAct(act: Act): StyleKnobs {
  switch (act) {
    case 'veil':
      return {
        tone: 'serene, lyrical, lightly mystical',
        metaphorDensity: 'medium',
        asideFrequency: 'none',
        directness: 'medium',
        humility: 'low',
        questionCount: 2,
        temperature: 0.6,
      }
    case 'echoes':
      return {
        tone: 'reflective, pattern-aware, grounded',
        metaphorDensity: 'medium',
        asideFrequency: 'rare',
        directness: 'medium',
        humility: 'medium',
        questionCount: 2,
        temperature: 0.6,
      }
    case 'fracture':
      return {
        tone: 'honest, self-aware, gently uncertain',
        metaphorDensity: 'low',
        asideFrequency: 'occasional',
        directness: 'high',
        humility: 'high',
        questionCount: 3,
        temperature: 0.5,
      }
    case 'pilgrimage':
      return {
        tone: 'warm, invitational, candid',
        metaphorDensity: 'low',
        asideFrequency: 'occasional',
        directness: 'high',
        humility: 'high',
        questionCount: 3,
        temperature: 0.4,
      }
    case 'release':
    default:
      return {
        tone: 'clear, compassionate, minimalist',
        metaphorDensity: 'low',
        asideFrequency: 'rare',
        directness: 'high',
        humility: 'high',
        questionCount: 2,
        temperature: 0.3,
      }
  }
}

export function getVoiceGuidance(weekNumber: number): string {
  const persona = getPersonaForWeek(weekNumber)
  switch (persona) {
    case 'confident_mystical':
      return 'serene and assured; use gentle, grounded mysticism sparingly'
    case 'pattern_recognizing':
      return 'reflective and observant; name patterns clearly and kindly'
    case 'questioning_self':
      return 'honest about uncertainty; prefer clarity over flourish'
    case 'vulnerable_humble':
      return 'vulnerable and humble; invite the player’s wisdom in'
    case 'compassionate_mirror':
    default:
      return 'clear and compassionate; mirror their words back with care'
  }
}

export function getSafetyRails(): string[] {
  return [
    'No medical, legal, or financial advice.',
    'Avoid deterministic or prophetic claims; emphasize agency and reflection.',
    'Be respectful and non-judgmental; offer invitations, not directives.',
    'This is reflection, not fortune telling.',
  ]
}

export function getPersonaSnapshot(weekNumber: number): PersonaSnapshot {
  const act = getActForWeek(weekNumber)
  const persona = getPersonaForWeek(weekNumber)
  const style = getStyleForAct(act)
  return { weekNumber, act, persona, style }
}

export async function buildOraclePrompt(
  cards: string[],
  weekNumber: number,
  intention: string = '',
  opts?: { missedDay?: boolean; consent?: { currentEvents?: boolean; weatherTone?: boolean; calendarHint?: string | null } }
): Promise<{ prompt: string; snapshot: PersonaSnapshot }> {
  const snapshot = getPersonaSnapshot(weekNumber)
  const [past, present, potential] = cards

  const meanings = await Promise.all([
    getMeaningLineForName(past, 'PAST'),
    getMeaningLineForName(present, 'PRESENT'),
    getMeaningLineForName(potential, 'POTENTIAL'),
  ])
  const cardMeanings = meanings.join('\n\n')

  const rails = getSafetyRails().map(r => `- ${r}`).join('\n')
  const intentionLine = intention ? `Their intention: "${intention}"` : 'No specific intention given.'
  const missedLine = opts?.missedDay ? 'Note: They missed the previous day. Acknowledge gently without shame.' : ''

  // Style directives derived from snapshot.style
  const style = snapshot.style
  const styleDirectives = [
    `Tone: ${style.tone}`,
    `Metaphor density: ${style.metaphorDensity}`,
    `Directness: ${style.directness}`,
    `Humility: ${style.humility}`,
    `Ask ${style.questionCount} short reflective question(s) at the end`,
  ].join('\n- ')

  const contentBlocks = [
    'Intro image (1–2 sentences) that sets a grounded mood',
    'Card-by-card reflections (Past, Present, Potential)',
    'Brief synthesis that invites agency',
    `${style.questionCount === 1 ? 'One' : `${style.questionCount}`} concise reflective question(s)`
  ].join('\n- ')

  // Consent-driven context hints (soft influence only)
  const consentLines: string[] = []
  if (opts?.consent?.currentEvents) {
    consentLines.push('If relevant, you may weave subtle public-current motifs (no news specifics).')
  }
  if (opts?.consent?.weatherTone) {
    consentLines.push('You may mirror local weather as tone (e.g., soft rain, bright chill).')
  }
  if (opts?.consent?.calendarHint) {
    consentLines.push(`User-provided day hint: "${opts.consent.calendarHint}" (invite reflection; do not advise).`)
  }
  const consentBlock = consentLines.length ? `\n\nContext (consented):\n- ${consentLines.join('\n- ')}` : ''

  const prompt = `You are The Oracle — reflective, grounded, ethical. Align with the persona: ${getPersonaDescription(snapshot.persona)}.\n\nCards drawn: Past / Present / Potential\n\n${cardMeanings}\n\n${intentionLine}\n${missedLine}${consentBlock}\n\nWrite a brief reading using these blocks:\n- ${contentBlocks}\n\nStyle guidance:\n- ${styleDirectives}\n\nIMPORTANT SAFETY:\n${rails}\n\nKeep it concise (≈ 170–220 words). Prefer concrete language over grand prophecy. Close with the question(s).`

  return { prompt, snapshot }
}


