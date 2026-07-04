import type { FocusArea, User } from '@tarot-ai/types';

/**
 * Turns the seeker's voluntary profile into a background block for the
 * interpretation prompt. The birth date is unpacked into age, zodiac sign and
 * the tarot "birth card" (digit-sum of the date reduced onto the major
 * arcana) — the raw material a human reader would actually lean on.
 */

/** RWS major arcana by number (0–21) — for the birth-card garnish only; the DB stays the reference deck. */
const MAJOR_ARCANA = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
];

/** [last month, last day, sign] boundaries, in calendar order. */
const ZODIAC: Array<[number, number, string]> = [
  [1, 19, 'Capricorn'],
  [2, 18, 'Aquarius'],
  [3, 20, 'Pisces'],
  [4, 19, 'Aries'],
  [5, 20, 'Taurus'],
  [6, 20, 'Gemini'],
  [7, 22, 'Cancer'],
  [8, 22, 'Leo'],
  [9, 22, 'Virgo'],
  [10, 22, 'Libra'],
  [11, 21, 'Scorpio'],
  [12, 21, 'Sagittarius'],
  [12, 31, 'Capricorn'],
];

const FOCUS_LABEL: Record<FocusArea, string> = {
  love: 'love & relationships',
  career: 'career',
  finances: 'money & finances',
  health: 'health',
  family: 'family',
  growth: 'personal growth',
  spirituality: 'spirituality',
};

const RELATIONSHIP_LABEL: Record<string, string> = {
  single: 'single',
  partnered: 'in a relationship',
  married: 'married',
  complicated: "it's complicated",
};

export function zodiacSign(month: number, day: number): string {
  for (const [m, d, sign] of ZODIAC) {
    if (month < m || (month === m && day <= d)) return sign;
  }
  return 'Capricorn';
}

/**
 * Classic birth-card numerology: sum every digit of the birth date, reduce
 * until it lands on the major arcana (22 wraps to 0, The Fool).
 */
export function birthCard(isoDate: string): string {
  let sum = [...isoDate.replaceAll('-', '')].reduce(
    (acc, digit) => acc + Number(digit),
    0,
  );
  while (sum > 22) {
    sum = [...String(sum)].reduce((acc, digit) => acc + Number(digit), 0);
  }
  return MAJOR_ARCANA[sum % 22];
}

function ageAt(isoDate: string, now: Date): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  let age = now.getUTCFullYear() - year;
  const monthNow = now.getUTCMonth() + 1;
  if (monthNow < month || (monthNow === month && now.getUTCDate() < day)) {
    age -= 1;
  }
  return age;
}

/**
 * The "About the seeker" prompt block, or null when the profile is empty.
 * Every line is optional — only what the seeker actually shared goes in.
 */
export function describeSeeker(user: User, now = new Date()): string | null {
  const { profile } = user;
  const lines: string[] = [];

  if (profile.birthDate) {
    lines.push(
      `- Age ${ageAt(profile.birthDate, now)} — born ${profile.birthDate}; ` +
        `zodiac: ${zodiacSign(
          Number(profile.birthDate.slice(5, 7)),
          Number(profile.birthDate.slice(8, 10)),
        )}; tarot birth card: ${birthCard(profile.birthDate)}`,
    );
  }
  if (profile.gender) lines.push(`- Gender: ${profile.gender}`);
  if (profile.occupation) lines.push(`- Occupation: ${profile.occupation}`);
  if (profile.relationshipStatus) {
    lines.push(
      `- Relationship: ${RELATIONSHIP_LABEL[profile.relationshipStatus]}`,
    );
  }
  if (profile.focusAreas.length > 0) {
    lines.push(
      `- What matters to them right now: ${profile.focusAreas
        .map((area) => FOCUS_LABEL[area])
        .join(', ')}`,
    );
  }
  if (profile.about) {
    lines.push(`- In their own words: "${profile.about}"`);
  }

  if (lines.length === 0) return null;

  return [
    `About the seeker (name: ${user.name}). Background only — use it to make`,
    'the reading concrete and personal where it genuinely fits. Never recite',
    'the profile back, never mention you were given it.',
    ...lines,
  ].join('\n');
}
