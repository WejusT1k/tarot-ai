import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Voluntary seeker-profile fields on `users` (mirrors the User entity) — birth
 * date, gender, self-description, occupation, relationship status, and focus
 * areas. All nullable/defaulted so existing accounts are untouched. Fed into
 * the AI interpretation prompt as background about the seeker.
 */
export class AddUserProfileFields1783209600000 implements MigrationInterface {
  name = 'AddUserProfileFields1783209600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "users_gender_enum" AS ENUM('female', 'male', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "users_relationship_status_enum" AS ENUM('single', 'partnered', 'married', 'complicated')`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "birth_date" date`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "gender" "users_gender_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "about" text`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "occupation" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "relationship_status" "users_relationship_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "focus_areas" text array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "focus_areas"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "relationship_status"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "occupation"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birth_date"`);
    await queryRunner.query(`DROP TYPE "users_relationship_status_enum"`);
    await queryRunner.query(`DROP TYPE "users_gender_enum"`);
  }
}
