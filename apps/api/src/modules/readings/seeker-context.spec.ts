import type { User, UserProfile } from '@tarot-ai/types';
import { birthCard, describeSeeker, zodiacSign } from './seeker-context';

const EMPTY_PROFILE: UserProfile = {
  birthDate: null,
  gender: null,
  about: null,
  occupation: null,
  relationshipStatus: null,
  focusAreas: [],
};

function seeker(profile: Partial<UserProfile>): User {
  return {
    id: 'u1',
    email: 'seeker@example.com',
    name: 'Morgana',
    avatarUrl: null,
    locale: 'en',
    createdAt: '2026-07-04T00:00:00.000Z',
    profile: { ...EMPTY_PROFILE, ...profile },
  };
}

describe('zodiacSign', () => {
  it.each([
    [3, 21, 'Aries'],
    [7, 22, 'Cancer'],
    [7, 23, 'Leo'],
    [12, 22, 'Capricorn'],
    [1, 19, 'Capricorn'],
    [1, 20, 'Aquarius'],
  ])('%i/%i → %s', (month, day, sign) => {
    expect(zodiacSign(month, day)).toBe(sign);
  });
});

describe('birthCard', () => {
  it('reduces the digit sum onto the major arcana', () => {
    // 1+9+9+0+0+7+2+3 = 31 → 3+1 = 4 → The Emperor
    expect(birthCard('1990-07-23')).toBe('The Emperor');
  });

  it('reduces two-step sums', () => {
    // 1+9+9+9+0+9+2+9 = 48 → 4+8 = 12 → The Hanged Man
    expect(birthCard('1999-09-29')).toBe('The Hanged Man');
  });

  it('wraps 22 to The Fool', () => {
    // 1+9+0+0+0+8+0+4 = 22 → The Fool
    expect(birthCard('1900-08-04')).toBe('The Fool');
  });
});

describe('describeSeeker', () => {
  const now = new Date('2026-07-04T12:00:00Z');

  it('returns null for an empty profile', () => {
    expect(describeSeeker(seeker({}), now)).toBeNull();
  });

  it('unpacks the birth date into age, zodiac and birth card', () => {
    const text = describeSeeker(seeker({ birthDate: '1990-07-23' }), now);

    expect(text).toContain('Age 35'); // birthday (Jul 23) not reached yet
    expect(text).toContain('zodiac: Leo');
    expect(text).toContain('tarot birth card: The Emperor');
  });

  it('computes age before vs after the birthday', () => {
    const before = describeSeeker(seeker({ birthDate: '1990-07-23' }), now);
    const after = describeSeeker(seeker({ birthDate: '1990-07-01' }), now);

    expect(before).toContain('Age 35');
    expect(after).toContain('Age 36');
  });

  it('lists only what the seeker shared', () => {
    const text = describeSeeker(
      seeker({
        occupation: 'Blacksmith',
        focusAreas: ['love', 'career'],
        about: 'Restless and curious.',
      }),
      now,
    );

    expect(text).toContain('Occupation: Blacksmith');
    expect(text).toContain('love & relationships, career');
    expect(text).toContain('"Restless and curious."');
    expect(text).not.toContain('Age');
    expect(text).not.toContain('Gender');
  });
});
