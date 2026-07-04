'use client';

import { useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  FOCUS_AREAS,
  GENDERS,
  RELATIONSHIP_STATUSES,
  type FocusArea,
  type Gender,
  type RelationshipStatus,
  type User,
} from '@tarot-ai/types';
import { useAuth } from './AuthProvider';
import styles from './ProfileModal.module.scss';

interface ProfileModalProps {
  /** The signed-in user whose profile seeds the form (mount = open). */
  user: User;
  onClose: () => void;
}

const GENDER_LABEL: Record<Gender, string> = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

const RELATIONSHIP_LABEL: Record<RelationshipStatus, string> = {
  single: 'Single',
  partnered: 'Partnered',
  married: 'Married',
  complicated: "It's complicated",
};

const FOCUS_LABEL: Record<FocusArea, string> = {
  love: 'Love',
  career: 'Career',
  finances: 'Finances',
  health: 'Health',
  family: 'Family',
  growth: 'Growth',
  spirituality: 'Spirituality',
};

/**
 * The seeker's profile on the same dark velvet panel as the auth modal.
 * Everything is voluntary; whatever is shared personalizes the AI reading
 * (birth date additionally yields the zodiac sign and tarot birth card
 * server-side). Mounted only while open, so state initializes from the user.
 */
export function ProfileModal({ user, onClose }: ProfileModalProps) {
  const { saveProfile } = useAuth();

  const [birthDate, setBirthDate] = useState(user.profile.birthDate ?? '');
  const [gender, setGender] = useState<Gender | null>(user.profile.gender);
  const [occupation, setOccupation] = useState(user.profile.occupation ?? '');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(
    user.profile.relationshipStatus,
  );
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(user.profile.focusAreas);
  const [about, setAbout] = useState(user.profile.about ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleFocus(area: FocusArea) {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);
    try {
      await saveProfile({
        birthDate: birthDate || null,
        gender,
        occupation: occupation.trim() || null,
        relationshipStatus,
        focusAreas,
        about: about.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'The ink would not take — please try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <div className={styles.panel}>
            <Dialog.Close className={styles.close} aria-label="Close">
              ✕
            </Dialog.Close>

            <div className={styles.ornament}>
              <span className={styles.ornLine} />
              <span className={styles.ornMark}>☿</span>
              <span className={styles.ornLine} />
            </div>

            <Dialog.Title className={styles.title}>The Seeker&apos;s Page</Dialog.Title>
            <p className={styles.blurb}>
              The more the reader knows of you, the sharper the reading. Your birth date reveals
              your sign and birth card; everything here is voluntary.
            </p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Date of birth</span>
                  <input
                    type="date"
                    className={styles.input}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    min="1900-01-01"
                    disabled={saving}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Occupation</span>
                  <input
                    type="text"
                    className={styles.input}
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="What fills your days?"
                    maxLength={120}
                    disabled={saving}
                  />
                </label>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Gender</span>
                <div className={styles.chips}>
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.chip} ${gender === g ? styles.chipOn : ''}`}
                      aria-pressed={gender === g}
                      onClick={() => setGender(gender === g ? null : g)}
                      disabled={saving}
                    >
                      {GENDER_LABEL[g]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Relationship</span>
                <div className={styles.chips}>
                  {RELATIONSHIP_STATUSES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`${styles.chip} ${relationshipStatus === r ? styles.chipOn : ''}`}
                      aria-pressed={relationshipStatus === r}
                      onClick={() => setRelationshipStatus(relationshipStatus === r ? null : r)}
                      disabled={saving}
                    >
                      {RELATIONSHIP_LABEL[r]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>What matters now</span>
                <div className={styles.chips}>
                  {FOCUS_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      className={`${styles.chip} ${focusAreas.includes(area) ? styles.chipOn : ''}`}
                      aria-pressed={focusAreas.includes(area)}
                      onClick={() => toggleFocus(area)}
                      disabled={saving}
                    >
                      {FOCUS_LABEL[area]}
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>About you</span>
                <textarea
                  className={styles.textarea}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell the cards who they are speaking to — your story, your crossroads…"
                  rows={4}
                  maxLength={600}
                  disabled={saving}
                />
              </label>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className={styles.submit} disabled={saving} aria-busy={saving}>
                {saving ? (
                  <>
                    <span className={styles.spinner} aria-hidden />
                    Inscribing…
                  </>
                ) : (
                  'Save my story'
                )}
              </button>
            </form>

            <div className={styles.ornament}>
              <span className={styles.ornLine} />
              <span className={styles.ornMark}>✦</span>
              <span className={styles.ornLine} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
