import { QuestionInput } from "@/components/ui/QuestionInput";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.scene}>
      {/* Atmospheric overlays — decorative, behind the foreground */}
      <div className={styles.vignette} />
      <div className={styles.grain} />

      {/* Foreground: title + the single mystical input */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>The cards are listening</p>
        <h1 className={styles.title}>Ask, and they will answer</h1>
        <QuestionInput />
      </div>

      {/* The cards will be dealt here (2D) once implemented. */}
    </main>
  );
}
