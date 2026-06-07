"use client";

import * as Dialog from "@radix-ui/react-dialog";
import styles from "./ReadingModal.module.scss";

interface ReadingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The question the spread was drawn for, shown as the scroll's heading. */
  question: string;
  /** The reading text, growing as the stream arrives. */
  text: string;
  /** Stream still in flight — shows the typing cursor. */
  streaming?: boolean;
  /** Error while interpreting. */
  error?: string | null;
}

/**
 * The AI reading, presented on an aged parchment scroll in a modal. Opens on
 * demand from the reading phase; the text streams in live while open.
 */
export function ReadingModal({
  open,
  onOpenChange,
  question,
  text,
  streaming = false,
  error,
}: ReadingModalProps) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  const showCursor = streaming && !error;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          aria-describedby={undefined}
        >
          <div className={styles.parchment}>
            <Dialog.Close className={styles.close} aria-label="Close the reading">
              ✕
            </Dialog.Close>

            <div className={styles.ornament}>
              <span className={styles.ornLine} />
              <span className={styles.ornMark}>✦</span>
              <span className={styles.ornLine} />
            </div>

            <Dialog.Title className={styles.title}>
              {question || "Your Reading"}
            </Dialog.Title>

            <div className={styles.scrollBody}>
              {error ? (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              ) : (
                <>
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className={styles.paragraph}>
                      {paragraph}
                      {showCursor && i === paragraphs.length - 1 && (
                        <span className={styles.cursor} aria-hidden />
                      )}
                    </p>
                  ))}
                  {paragraphs.length === 0 && (
                    <p className={styles.paragraph}>
                      <span className={styles.summon}>
                        The reader turns the cards
                      </span>
                      {showCursor && (
                        <span className={styles.cursor} aria-hidden />
                      )}
                    </p>
                  )}
                </>
              )}
            </div>

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
