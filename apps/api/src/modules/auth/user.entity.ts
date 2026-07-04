import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import {
  GENDERS,
  LOCALES,
  RELATIONSHIP_STATUSES,
  type FocusArea,
  type Gender,
  type Locale,
  type RelationshipStatus,
} from '@tarot-ai/types';

/**
 * A registered account (email + password for now). The `id` is generated in
 * app code (`crypto.randomUUID()`) rather than by the DB, so the schema needs
 * no uuid extension and synchronize/migrations stay in lockstep.
 *
 * Never returned by the API directly — `AuthService.toPublicUser()` strips the
 * password hash and maps to the shared `User` type.
 */
@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  /** Stored lowercased — lookups are case-insensitive by normalization. */
  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar', { name: 'password_hash' })
  passwordHash!: string;

  @Column('varchar', { name: 'avatar_url', nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'enum', enum: LOCALES, default: 'en' })
  locale!: Locale;

  // --- Seeker profile (all voluntary) — folded into the interpret prompt. ---

  /** ISO date string (Postgres `date` comes back as 'YYYY-MM-DD'). */
  @Column('date', { name: 'birth_date', nullable: true })
  birthDate!: string | null;

  @Column({ type: 'enum', enum: GENDERS, nullable: true })
  gender!: Gender | null;

  @Column('text', { nullable: true })
  about!: string | null;

  @Column('varchar', { nullable: true })
  occupation!: string | null;

  @Column({
    type: 'enum',
    enum: RELATIONSHIP_STATUSES,
    name: 'relationship_status',
    nullable: true,
  })
  relationshipStatus!: RelationshipStatus | null;

  /** Plain text[] (values validated app-side against FOCUS_AREAS). */
  @Column('text', { name: 'focus_areas', array: true, default: () => "'{}'" })
  focusAreas!: FocusArea[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
