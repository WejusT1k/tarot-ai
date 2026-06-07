"use client";

import styles from "./QuestionInput.module.scss";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** Request in flight — disables the field and shows a loader in the button. */
  loading?: boolean;
  /** Validation / request error shown beneath the button. */
  error?: string | null;
}

export function QuestionInput({
  value,
  onChange,
  onSubmit,
  loading = false,
  error,
}: QuestionInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
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
          disabled={loading}
          className={styles.input}
        />
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className={styles.spinner} aria-hidden />
            Consulting the cards…
          </>
        ) : (
          "Reveal the spread"
        )}
      </button>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
