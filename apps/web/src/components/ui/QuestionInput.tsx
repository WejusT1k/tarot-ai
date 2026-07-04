'use client';

import styles from './QuestionInput.module.scss';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Submit the question to draw the spread. */
  onSubmit: () => void;
  /** Ask the AI to interpret the drawn spread (reading phase only). */
  onInterpret: () => void;
  /** Discard the current spread and ask a fresh question. */
  onNewReading: () => void;
  /** false = asking phase (one reveal button); true = reading phase (two actions). */
  hasDrawn: boolean;
  /** Draw request in flight — disables the field and shows a loader in the button. */
  loading?: boolean;
  /** AI interpretation stream in flight. */
  interpreting?: boolean;
  /** The reading has already been interpreted — lock the interpret button. */
  interpreted?: boolean;
  /** Validation / request error shown beneath the button. */
  error?: string | null;
}

export function QuestionInput({
  value,
  onChange,
  onSubmit,
  onInterpret,
  onNewReading,
  hasDrawn,
  loading = false,
  interpreting = false,
  interpreted = false,
  error,
}: QuestionInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!hasDrawn) onSubmit();
      }}
      className={styles.form}
      noValidate
    >
      <div className={styles.prompt}>
        <span className={`${styles.promptLine} ${styles.left}`} />
        <span className={styles.promptLabel}>Speak your question</span>
        <span className={`${styles.promptLine} ${styles.right}`} />
      </div>

      <div className={styles.fieldWrap}>
        <div className={styles.glow} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Whisper your question to the cards…"
          aria-label="Your question for the cards"
          aria-invalid={Boolean(error)}
          autoComplete="off"
          disabled={loading || hasDrawn}
          className={styles.input}
        />
      </div>

      {hasDrawn ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.submit}
            onClick={onInterpret}
            disabled={interpreting}
            aria-busy={interpreting}
          >
            {interpreting ? (
              <>
                <span className={styles.spinner} aria-hidden />
                Reading the cards…
              </>
            ) : interpreted ? (
              'View reading'
            ) : (
              'Interpret with AI'
            )}
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={onNewReading}
            disabled={interpreting}
          >
            New reading
          </button>
        </div>
      ) : (
        <button
          type="submit"
          className={`${styles.submit} ${styles.solo}`}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner} aria-hidden />
              Consulting the cards…
            </>
          ) : (
            'Reveal the spread'
          )}
        </button>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
