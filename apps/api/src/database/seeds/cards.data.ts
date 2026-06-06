import type { Card, Suit } from '@tarot-ai/types';

export type SeedCard = Omit<Card, 'id'>;

const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const pad2 = (n: number): string => String(n).padStart(2, '0');

// ---------------------------------------------------------------------------
// Major Arcana (0–21)
// ---------------------------------------------------------------------------

interface MajorSeed {
  number: number;
  name: string;
  description: string;
  upright: string;
  reversed: string;
  keywords: string[];
}

const MAJOR: MajorSeed[] = [
  {
    number: 0,
    name: 'The Fool',
    description:
      'A carefree wanderer steps toward a cliff edge, open to the unknown.',
    upright:
      'New beginnings, spontaneity, and a leap of faith into the unknown.',
    reversed: 'Recklessness, naivety, and fear of taking the first step.',
    keywords: ['beginnings', 'spontaneity', 'innocence', 'leap of faith'],
  },
  {
    number: 1,
    name: 'The Magician',
    description:
      'A figure channels the powers above and below to manifest his will.',
    upright:
      'Manifestation, willpower, and the resourcefulness to make things real.',
    reversed: 'Manipulation, untapped talent, and scattered intentions.',
    keywords: ['manifestation', 'willpower', 'power', 'skill'],
  },
  {
    number: 2,
    name: 'The High Priestess',
    description:
      'A veiled guardian sits between two pillars, keeper of hidden knowledge.',
    upright: 'Intuition, mystery, and the wisdom of the subconscious.',
    reversed: 'Secrets withheld, and disconnection from your inner voice.',
    keywords: ['intuition', 'mystery', 'subconscious', 'inner voice'],
  },
  {
    number: 3,
    name: 'The Empress',
    description:
      'An abundant mother-figure reclines amid a flourishing garden.',
    upright: 'Abundance, nurturing, fertility, and creative flourishing.',
    reversed: 'Creative block, dependence, and neglect of self-care.',
    keywords: ['abundance', 'nurturing', 'fertility', 'nature'],
  },
  {
    number: 4,
    name: 'The Emperor',
    description: 'A sovereign on a stone throne embodies order and command.',
    upright: 'Authority, structure, stability, and protective control.',
    reversed: 'Domination, rigidity, and the misuse of power.',
    keywords: ['authority', 'structure', 'control', 'stability'],
  },
  {
    number: 5,
    name: 'The Hierophant',
    description:
      'A spiritual teacher blesses two seekers within a sacred hall.',
    upright: 'Tradition, shared belief, guidance, and spiritual learning.',
    reversed: 'Rebellion, nonconformity, and questioning convention.',
    keywords: ['tradition', 'spirituality', 'conformity', 'guidance'],
  },
  {
    number: 6,
    name: 'The Lovers',
    description:
      'Two figures stand beneath an angel, bound by choice and union.',
    upright: 'Love, union, harmony, and a meaningful choice of the heart.',
    reversed: 'Disharmony, misalignment of values, and broken trust.',
    keywords: ['love', 'union', 'choices', 'harmony'],
  },
  {
    number: 7,
    name: 'The Chariot',
    description: 'A driver steers opposing forces forward by sheer will.',
    upright: 'Willpower, determination, and victory through control.',
    reversed: 'Loss of direction, opposition, and scattered drive.',
    keywords: ['willpower', 'victory', 'determination', 'control'],
  },
  {
    number: 8,
    name: 'Strength',
    description: 'A gentle figure calms a lion with patience, not force.',
    upright: 'Courage, inner strength, patience, and quiet compassion.',
    reversed: 'Self-doubt, weakness, and raw, unmastered emotion.',
    keywords: ['courage', 'inner strength', 'compassion', 'patience'],
  },
  {
    number: 9,
    name: 'The Hermit',
    description: 'A cloaked elder lifts a lantern alone on a dark peak.',
    upright: 'Introspection, solitude, and the search for inner truth.',
    reversed: 'Isolation, withdrawal, and loneliness without insight.',
    keywords: ['introspection', 'solitude', 'guidance', 'searching'],
  },
  {
    number: 10,
    name: 'Wheel of Fortune',
    description: 'A great wheel turns, carrying fates up and down with it.',
    upright: 'Cycles, fate, turning points, and a change of fortune.',
    reversed: 'Bad luck, resistance to change, and clinging to control.',
    keywords: ['cycles', 'fate', 'turning point', 'change'],
  },
  {
    number: 11,
    name: 'Justice',
    description: 'A robed judge holds scales and an upright sword.',
    upright: 'Fairness, truth, accountability, and just consequence.',
    reversed: 'Injustice, dishonesty, and avoidance of responsibility.',
    keywords: ['justice', 'truth', 'accountability', 'fairness'],
  },
  {
    number: 12,
    name: 'The Hanged Man',
    description: 'A man hangs serenely upside-down, seeing the world anew.',
    upright: 'Surrender, pause, and a liberating change of perspective.',
    reversed: 'Stalling, resistance, and needless self-sacrifice.',
    keywords: ['surrender', 'new perspective', 'pause', 'letting go'],
  },
  {
    number: 13,
    name: 'Death',
    description:
      'A pale rider marks the close of one chapter and the dawn of another.',
    upright: 'Endings, transformation, and necessary transition.',
    reversed: 'Resistance to change, stagnation, and holding on too long.',
    keywords: ['endings', 'transformation', 'transition', 'release'],
  },
  {
    number: 14,
    name: 'Temperance',
    description: 'An angel blends water between two cups in perfect measure.',
    upright: 'Balance, moderation, patience, and graceful synthesis.',
    reversed: 'Imbalance, excess, and impatience with the process.',
    keywords: ['balance', 'moderation', 'patience', 'harmony'],
  },
  {
    number: 15,
    name: 'The Devil',
    description:
      'Chained figures linger willingly before a looming horned idol.',
    upright: 'Bondage, temptation, materialism, and self-imposed chains.',
    reversed: 'Release, breaking free, and reclaiming your power.',
    keywords: ['bondage', 'temptation', 'materialism', 'shadow'],
  },
  {
    number: 16,
    name: 'The Tower',
    description: 'Lightning strikes a tower, casting figures into the night.',
    upright: 'Sudden upheaval, revelation, and the fall of false structures.',
    reversed: 'Fear of change, delayed disaster, and clinging to ruins.',
    keywords: ['upheaval', 'chaos', 'revelation', 'awakening'],
  },
  {
    number: 17,
    name: 'The Star',
    description: 'A figure pours water beneath a sky of guiding stars.',
    upright: 'Hope, inspiration, renewal, and serene faith in the future.',
    reversed: 'Despair, disconnection, and loss of hope.',
    keywords: ['hope', 'inspiration', 'renewal', 'faith'],
  },
  {
    number: 18,
    name: 'The Moon',
    description: 'A pale moon lights a winding path between fear and instinct.',
    upright: 'Illusion, intuition, and navigating fear and the unknown.',
    reversed: 'Confusion lifting, released fear, and returning clarity.',
    keywords: ['illusion', 'fear', 'intuition', 'subconscious'],
  },
  {
    number: 19,
    name: 'The Sun',
    description: 'A radiant sun shines on a child riding freely through bloom.',
    upright: 'Joy, success, vitality, and warm, open-hearted clarity.',
    reversed: 'Temporary gloom, blocked joy, and dimmed enthusiasm.',
    keywords: ['joy', 'success', 'vitality', 'positivity'],
  },
  {
    number: 20,
    name: 'Judgement',
    description: 'An angel’s trumpet calls figures to rise and be renewed.',
    upright: 'Reckoning, awakening, and a renewed sense of calling.',
    reversed: 'Self-doubt, refusal of the call, and harsh self-judgement.',
    keywords: ['reckoning', 'awakening', 'renewal', 'calling'],
  },
  {
    number: 21,
    name: 'The World',
    description: 'A dancer is wreathed in a laurel, the cycle made whole.',
    upright: 'Completion, fulfillment, wholeness, and accomplishment.',
    reversed: 'Incompletion, loose ends, and delayed closure.',
    keywords: ['completion', 'fulfillment', 'wholeness', 'achievement'],
  },
];

// ---------------------------------------------------------------------------
// Minor Arcana (4 suits × 14 ranks) — composed from suit + rank archetypes,
// the same element × number logic the Rider-Waite minors follow.
// ---------------------------------------------------------------------------

interface SuitMeta {
  suit: Suit;
  element: string;
  domain: string; // the life arena this suit governs
  keyword: string;
}

const SUITS: SuitMeta[] = [
  {
    suit: 'wands',
    element: 'Fire',
    domain: 'passion, drive, and creativity',
    keyword: 'ambition',
  },
  {
    suit: 'cups',
    element: 'Water',
    domain: 'emotions, love, and relationships',
    keyword: 'feeling',
  },
  {
    suit: 'swords',
    element: 'Air',
    domain: 'thought, truth, and conflict',
    keyword: 'intellect',
  },
  {
    suit: 'pentacles',
    element: 'Earth',
    domain: 'work, money, and the material world',
    keyword: 'security',
  },
];

interface RankMeta {
  number: number;
  name: string;
  upright: string;
  reversed: string;
  keywords: string[];
}

const RANKS: RankMeta[] = [
  {
    number: 1,
    name: 'Ace',
    upright: 'a fresh spark of raw potential and a new opening',
    reversed: 'blocked potential and a missed or delayed start',
    keywords: ['new beginning', 'potential', 'opportunity'],
  },
  {
    number: 2,
    name: 'Two',
    upright: 'balance, partnership, and an early choice',
    reversed: 'imbalance, indecision, and hesitation',
    keywords: ['balance', 'choice', 'partnership'],
  },
  {
    number: 3,
    name: 'Three',
    upright: 'growth, collaboration, and first results',
    reversed: 'setbacks, lack of teamwork, and stalled growth',
    keywords: ['growth', 'collaboration', 'progress'],
  },
  {
    number: 4,
    name: 'Four',
    upright: 'stability, foundations, and consolidation',
    reversed: 'stagnation, clinging, and shaky ground',
    keywords: ['stability', 'foundation', 'rest'],
  },
  {
    number: 5,
    name: 'Five',
    upright: 'conflict, loss, and testing challenge',
    reversed: 'recovery, resolution, and moving past hardship',
    keywords: ['conflict', 'challenge', 'loss'],
  },
  {
    number: 6,
    name: 'Six',
    upright: 'harmony, progress, and well-earned relief',
    reversed: 'delay, imbalance, and stalled momentum',
    keywords: ['harmony', 'progress', 'relief'],
  },
  {
    number: 7,
    name: 'Seven',
    upright: 'perseverance, assessment, and standing your ground',
    reversed: 'doubt, giving up, and wasted effort',
    keywords: ['perseverance', 'assessment', 'patience'],
  },
  {
    number: 8,
    name: 'Eight',
    upright: 'momentum, mastery, and focused movement',
    reversed: 'stagnation, scattered focus, and stalling',
    keywords: ['movement', 'mastery', 'focus'],
  },
  {
    number: 9,
    name: 'Nine',
    upright: 'resilience near completion and hard-won strength',
    reversed: 'anxiety, overwhelm, and depleted reserves',
    keywords: ['resilience', 'attainment', 'strength'],
  },
  {
    number: 10,
    name: 'Ten',
    upright: 'culmination, completion, and the full weight of the cycle',
    reversed: 'burden, collapse, and a cycle overstayed',
    keywords: ['completion', 'culmination', 'fulfillment'],
  },
  {
    number: 11,
    name: 'Page',
    upright: 'curiosity, a message, and eager early learning',
    reversed: 'immaturity, blocked news, and restlessness',
    keywords: ['curiosity', 'message', 'learning'],
  },
  {
    number: 12,
    name: 'Knight',
    upright: 'bold action and single-minded pursuit',
    reversed: 'recklessness, haste, and misdirected energy',
    keywords: ['action', 'pursuit', 'drive'],
  },
  {
    number: 13,
    name: 'Queen',
    upright: 'inward mastery, nurturing depth, and quiet command',
    reversed: 'imbalance, smothering, and self-neglect',
    keywords: ['nurturing', 'mastery', 'depth'],
  },
  {
    number: 14,
    name: 'King',
    upright: 'outward mastery, authority, and seasoned command',
    reversed: 'domination, coldness, and misuse of authority',
    keywords: ['authority', 'mastery', 'leadership'],
  },
];

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function buildMajors(): SeedCard[] {
  return MAJOR.map((m) => ({
    name: m.name,
    arcana: 'major',
    suit: null,
    number: m.number,
    description: m.description,
    uprightMeaning: m.upright,
    reversedMeaning: m.reversed,
    keywords: m.keywords,
    imageUrl: `/cards/major/${pad2(m.number)}-${slug(m.name)}.jpg`,
  }));
}

function buildMinors(): SeedCard[] {
  const cards: SeedCard[] = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      const name = `${r.name} of ${cap(s.suit)}`;
      cards.push({
        name,
        arcana: 'minor',
        suit: s.suit,
        number: r.number,
        description: `${name} — ${s.element}. ${cap(r.upright)}, in matters of ${s.domain}.`,
        uprightMeaning: `${cap(r.upright)}, in the realm of ${s.domain}.`,
        reversedMeaning: `${cap(r.reversed)}, in the realm of ${s.domain}.`,
        keywords: [...r.keywords, s.keyword],
        imageUrl: `/cards/minor/${s.suit}/${slug(r.name)}-of-${s.suit}.jpg`,
      });
    }
  }
  return cards;
}

/** The full immutable deck: 22 major + 56 minor = 78 cards. Order defines seed ids 1–78. */
export const DECK: SeedCard[] = [...buildMajors(), ...buildMinors()];
