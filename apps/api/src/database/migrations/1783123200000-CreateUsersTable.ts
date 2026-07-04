import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Accounts for email + password auth. Mirrors the User entity
 * (apps/api/src/modules/auth/user.entity.ts). The uuid PK is generated in app
 * code, so the table needs no uuid extension / default. Enum type name follows
 * TypeORM's `{table}_{column}_enum` convention (see CreateCardsTable).
 */
export class CreateUsersTable1783123200000 implements MigrationInterface {
  name = 'CreateUsersTable1783123200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "users_locale_enum" AS ENUM('en', 'ua')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "email" character varying NOT NULL,
        "name" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "avatar_url" character varying,
        "locale" "users_locale_enum" NOT NULL DEFAULT 'en',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "users_locale_enum"`);
  }
}
