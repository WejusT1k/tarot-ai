import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial schema: the immutable 78-card reference deck.
 * Mirrors Card entity (apps/api/src/modules/cards/card.entity.ts). Enum type
 * names follow TypeORM's `{table}_{column}_enum` convention so future
 * `migration:generate` runs diff cleanly against the entity.
 */
export class CreateCardsTable1749300000000 implements MigrationInterface {
  name = 'CreateCardsTable1749300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "cards_arcana_enum" AS ENUM('major', 'minor')`,
    );
    await queryRunner.query(
      `CREATE TYPE "cards_suit_enum" AS ENUM('wands', 'cups', 'swords', 'pentacles')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cards" (
        "id" integer NOT NULL,
        "name" character varying NOT NULL,
        "arcana" "cards_arcana_enum" NOT NULL,
        "suit" "cards_suit_enum",
        "number" integer NOT NULL,
        "description" text NOT NULL,
        "upright_meaning" text NOT NULL,
        "reversed_meaning" text NOT NULL,
        "keywords" text array NOT NULL,
        "image_url" character varying NOT NULL,
        CONSTRAINT "PK_cards_id" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cards"`);
    await queryRunner.query(`DROP TYPE "cards_suit_enum"`);
    await queryRunner.query(`DROP TYPE "cards_arcana_enum"`);
  }
}
