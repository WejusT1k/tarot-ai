'use client';

import { useRef, useState } from 'react';
import type { ReadingCard } from '@tarot-ai/types';
import { ApiError, drawReading, interpretReading } from '@/lib/api';
import { CardSpread, type SpreadCard } from '@/components/cards/CardSpread';
import { QuestionInput } from '@/components/ui/QuestionInput';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { AuthStatus } from '@/components/auth/AuthStatus';
import { ProfileModal } from '@/components/auth/ProfileModal';
import { ReadingModal } from './ReadingModal';
import styles from './ReadingFlow.module.scss';

const MIN_QUESTION_LENGTH = 5;

/**
 * Owns the reading flow across two phases:
 *  1. Ask — question + validation + the draw request (free, no account).
 *  2. Reading — the drawn spread, plus the on-demand AI interpretation (a
 *     separate streamed request, sign-in required) and a "New reading" reset.
 * A guest tapping "Interpret with AI" gets the auth modal instead; once the
 * session lands, the interpretation continues on its own.
 * The page stays a server component; this is the interactive island.
 */
export function ReadingFlow() {
  const { status, token, user, signOut } = useAuth();

  const [question, setQuestion] = useState('');
  // Raw drawn cards (kept so we can ask the AI to interpret the exact spread).
  const [drawn, setDrawn] = useState<ReadingCard[] | null>(null);
  const [cards, setCards] = useState<SpreadCard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bumped per draw so CardSpread remounts and re-plays its deal/reveal.
  const [drawId, setDrawId] = useState(0);

  // AI interpretation step — streamed into a parchment modal.
  const [interpretation, setInterpretation] = useState('');
  const [interpreting, setInterpreting] = useState(false);
  const [interpretError, setInterpretError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // The question the open reading was drawn for (frozen at interpret time).
  const [readingQuestion, setReadingQuestion] = useState('');

  // The auth gate: a guest's interpret click opens the modal and parks the
  // intent here; the modal's onSuccess resumes it once the session is in.
  const [authOpen, setAuthOpen] = useState(false);
  const pendingInterpret = useRef(false);

  // The seeker's profile sheet — mounted only while open so its form state
  // initializes from the current user.
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleSubmit() {
    const trimmed = question.trim();
    if (trimmed.length < MIN_QUESTION_LENGTH) {
      setError(`Ask a fuller question — at least ${MIN_QUESTION_LENGTH} characters.`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await drawReading('three_card');
      setDrawn(result);
      setCards(result.map((c) => ({ card: c.card, reversed: c.isReversed })));
      setDrawId((n) => n + 1);
    } catch {
      setError('The cards are clouded right now — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function runInterpret(authToken: string) {
    if (!drawn) return;

    // Reopen the existing reading instead of re-streaming it.
    setModalOpen(true);
    if (interpretation || interpreting) return;

    setReadingQuestion(question.trim());
    setInterpreting(true);
    setInterpretation('');
    setInterpretError(null);
    try {
      await interpretReading(
        {
          question: question.trim(),
          locale: 'en',
          spreadType: 'three_card',
          cards: drawn.map((c) => ({
            cardId: c.card.id,
            positionName: c.positionName,
            isReversed: c.isReversed,
          })),
        },
        authToken,
        (delta) => setInterpretation((prev) => prev + delta),
      );
    } catch (err) {
      // An expired session shouldn't read as a mystical failure — drop the
      // dead token and reopen the gate.
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        setModalOpen(false);
        pendingInterpret.current = true;
        setAuthOpen(true);
      } else {
        setInterpretError("The reader's voice falters — please try again.");
      }
    } finally {
      setInterpreting(false);
    }
  }

  function handleInterpret() {
    if (!drawn) return;

    // The reading is for the initiated: guests sign in first, then the
    // interpretation resumes via the modal's onSuccess (Decision #11).
    if (status !== 'authed' || !token) {
      pendingInterpret.current = true;
      setAuthOpen(true);
      return;
    }

    void runInterpret(token);
  }

  function handleNewReading() {
    setDrawn(null);
    setCards(null);
    setQuestion('');
    setError(null);
    setInterpretation('');
    setInterpretError(null);
    setModalOpen(false);
    setReadingQuestion('');
    pendingInterpret.current = false;
  }

  const hasDrawn = Boolean(cards);
  const interpreted = interpretation.length > 0 && !interpreting;

  return (
    <div className={styles.foreground}>
      <AuthStatus onSignIn={() => setAuthOpen(true)} onOpenProfile={() => setProfileOpen(true)} />

      <div className={styles.header}>
        <p className={styles.eyebrow}>The cards are listening</p>
        <h1 className={styles.title}>Ask, and they will answer</h1>
        <QuestionInput
          value={question}
          onChange={(value) => {
            setQuestion(value);
            if (error) setError(null);
          }}
          onSubmit={handleSubmit}
          onInterpret={handleInterpret}
          onNewReading={handleNewReading}
          hasDrawn={hasDrawn}
          loading={loading}
          interpreting={interpreting}
          interpreted={interpreted}
          error={error}
        />
      </div>

      <div className={styles.spread}>{cards && <CardSpread key={drawId} cards={cards} />}</div>

      <AuthModal
        open={authOpen}
        onOpenChange={(open) => {
          setAuthOpen(open);
          // Closing the gate unresolved abandons the parked interpretation.
          if (!open) pendingInterpret.current = false;
        }}
        onSuccess={(freshToken) => {
          setAuthOpen(false);
          if (pendingInterpret.current) {
            pendingInterpret.current = false;
            void runInterpret(freshToken);
          }
        }}
      />

      {profileOpen && user && <ProfileModal user={user} onClose={() => setProfileOpen(false)} />}

      <ReadingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        question={readingQuestion}
        text={interpretation}
        streaming={interpreting}
        error={interpretError}
      />
    </div>
  );
}
