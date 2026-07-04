import { ReadingFlow } from '@/components/reading/ReadingFlow';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.scene}>
      {/* Atmospheric overlays — decorative, behind the foreground */}
      <div className={styles.vignette} />
      <div className={styles.grain} />

      {/* Interactive island: question → draw → spread */}
      <ReadingFlow />
    </main>
  );
}
