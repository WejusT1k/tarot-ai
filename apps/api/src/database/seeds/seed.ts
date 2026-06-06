import { AppDataSource } from '../data-source';
import { Card } from '../../modules/cards/card.entity';
import { DECK } from './cards.data';

/** Seed the immutable 78-card deck. Idempotent: upserts by stable id (1–78). */
async function seed(): Promise<void> {
  await AppDataSource.initialize();
  try {
    const repo = AppDataSource.getRepository(Card);
    const cards = DECK.map((card, index) => ({ ...card, id: index + 1 }));

    await repo.upsert(cards, ['id']);

    const total = await repo.count();
    // eslint-disable-next-line no-console
    console.log(`Seeded ${cards.length} cards. Deck now has ${total} rows.`);
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err);
  process.exit(1);
});
