import { QuestionInput } from "@/components/ui/QuestionInput";
import { CardSpread, type SpreadCard } from "@/components/cards/CardSpread";
import styles from "./page.module.scss";

// Temporary sample spread to preview the cards before the deal flow is wired to
// the backend. One upright major, one reversed major, one minor.
const SAMPLE_CARDS: SpreadCard[] = [
  {
    card: {
      id: 1,
      name: "The Fool",
      arcana: "major",
      suit: null,
      number: 0,
      description:
        "A carefree wanderer steps toward a cliff edge, open to the unknown.",
      uprightMeaning:
        "New beginnings, spontaneity, and a leap of faith into the unknown.",
      reversedMeaning:
        "Recklessness, naivety, and fear of taking the first step.",
      keywords: ["beginnings", "spontaneity", "innocence", "leap of faith"],
      imageUrl: "/cards/major/00-the-fool.jpg",
    },
  },
  {
    reversed: true,
    card: {
      id: 18,
      name: "The Star",
      arcana: "major",
      suit: null,
      number: 17,
      description: "A figure pours water beneath a sky of guiding stars.",
      uprightMeaning:
        "Hope, inspiration, renewal, and serene faith in the future.",
      reversedMeaning: "Despair, disconnection, and loss of hope.",
      keywords: ["hope", "inspiration", "renewal", "faith"],
      imageUrl: "/cards/major/17-the-star.jpg",
    },
  },
  {
    card: {
      id: 51,
      name: "Ace of Cups",
      arcana: "minor",
      suit: "cups",
      number: 1,
      description:
        "Ace of Cups — Water. A fresh spark of raw potential and a new opening, in matters of emotions, love, and relationships.",
      uprightMeaning:
        "A fresh spark of raw potential and a new opening, in the realm of emotions, love, and relationships.",
      reversedMeaning:
        "Blocked potential and a missed or delayed start, in the realm of emotions, love, and relationships.",
      keywords: ["new beginning", "potential", "opportunity", "feeling"],
      imageUrl: "/cards/minor/cups/ace-of-cups.jpg",
    },
  },
];

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
      <div className={styles.deal}>
        <CardSpread cards={SAMPLE_CARDS} />
      </div>
    </main>
  );
}
