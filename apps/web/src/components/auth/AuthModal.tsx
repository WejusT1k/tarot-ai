'use client';

import { useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuth } from './AuthProvider';
import styles from './AuthModal.module.scss';

type Mode = 'signin' | 'signup';

interface AuthModalProps {
  open: boolean;
  /** Fires only on user dismissal — success goes through `onSuccess`. */
  onOpenChange: (open: boolean) => void;
  /** Session accepted; receives the fresh bearer token. Owner closes us. */
  onSuccess: (token: string) => void;
}

const COPY: Record<Mode, { title: string; blurb: string; submit: string; busy: string }> = {
  signin: {
    title: 'Enter the Circle',
    blurb: 'The cards speak only to the initiated. Sign in to hear your reading.',
    submit: 'Sign in',
    busy: 'Unsealing…',
  },
  signup: {
    title: 'Join the Circle',
    blurb: 'Take a name among the initiated, and the cards will answer you.',
    submit: 'Create account',
    busy: 'Inscribing…',
  },
};

/**
 * Login / registration on a dark velvet panel, matching the scene's fantasy
 * dressing. Shown when a guest asks for the AI interpretation (the draw stays
 * free); closes itself once the session is accepted.
 */
export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = COPY[mode];

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const token =
        mode === 'signup'
          ? await signUp({ name, email, password })
          : await signIn({ email, password });
      setPassword('');
      // `onOpenChange(false)` stays reserved for user dismissal.
      onSuccess(token);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'The seal would not yield — please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <div className={styles.panel}>
            <Dialog.Close className={styles.close} aria-label="Close">
              ✕
            </Dialog.Close>

            <div className={styles.ornament}>
              <span className={styles.ornLine} />
              <span className={styles.ornMark}>☾</span>
              <span className={styles.ornLine} />
            </div>

            <Dialog.Title className={styles.title}>{copy.title}</Dialog.Title>
            <p className={styles.blurb}>{copy.blurb}</p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {mode === 'signup' && (
                <label className={styles.field}>
                  <span className={styles.label}>Your name</span>
                  <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How shall the cards call you?"
                    autoComplete="name"
                    disabled={submitting}
                  />
                </label>
              )}

              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="raven@midnight.tower"
                  autoComplete="email"
                  disabled={submitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Password</span>
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="A secret only you keep"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  disabled={submitting}
                />
              </label>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <span className={styles.spinner} aria-hidden />
                    {copy.busy}
                  </>
                ) : (
                  copy.submit
                )}
              </button>
            </form>

            <p className={styles.switchRow}>
              {mode === 'signin' ? (
                <>
                  New to the circle?{' '}
                  <button
                    type="button"
                    className={styles.switchLink}
                    onClick={() => switchMode('signup')}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already initiated?{' '}
                  <button
                    type="button"
                    className={styles.switchLink}
                    onClick={() => switchMode('signin')}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

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
