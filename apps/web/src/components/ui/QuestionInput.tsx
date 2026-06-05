"use client";

import { useState } from "react";
import styles from "./QuestionInput.module.scss";

export function QuestionInput() {
  const [question, setQuestion] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wired to the reading flow in a later phase.
    console.log("question:", question);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.prompt}>
        <span className={`${styles.promptLine} ${styles.left}`} />
        <span className={styles.promptLabel}>Speak your question</span>
        <span className={`${styles.promptLine} ${styles.right}`} />
      </div>

      <div className={styles.fieldWrap}>
        <div className={styles.glow} />
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Whisper your question to the cards…"
          aria-label="Your question for the cards"
          autoComplete="off"
          className={styles.input}
        />
      </div>
    </form>
  );
}
