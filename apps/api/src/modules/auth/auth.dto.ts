import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FOCUS_AREAS,
  GENDERS,
  RELATIONSHIP_STATUSES,
  type AuthResponse,
  type FocusArea,
  type Gender,
  type LoginRequest,
  type Locale,
  type RegisterRequest,
  type RelationshipStatus,
  type UpdateProfileRequest,
  type User,
  type UserProfile,
} from '@tarot-ai/types';

export class RegisterDto implements RegisterRequest {
  @ApiProperty({ example: 'Morgana' })
  name!: string;

  @ApiProperty({ example: 'seeker@example.com' })
  email!: string;

  @ApiProperty({ example: 'correct-horse-battery', minLength: 8 })
  password!: string;
}

export class LoginDto implements LoginRequest {
  @ApiProperty({ example: 'seeker@example.com' })
  email!: string;

  @ApiProperty({ example: 'correct-horse-battery' })
  password!: string;
}

/** Voluntary seeker background — folded into the interpretation prompt. */
export class UserProfileDto implements UserProfile {
  @ApiProperty({ nullable: true, type: String, example: '1990-07-23' })
  birthDate!: string | null;

  @ApiProperty({ enum: GENDERS, nullable: true })
  gender!: Gender | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Self-description',
  })
  about!: string | null;

  @ApiProperty({ nullable: true, type: String, example: 'Software engineer' })
  occupation!: string | null;

  @ApiProperty({ enum: RELATIONSHIP_STATUSES, nullable: true })
  relationshipStatus!: RelationshipStatus | null;

  @ApiProperty({
    enum: FOCUS_AREAS,
    isArray: true,
    example: ['love', 'career'],
  })
  focusAreas!: FocusArea[];
}

/** The public user shape — never includes the password hash. */
export class PublicUserDto implements User {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'seeker@example.com' })
  email!: string;

  @ApiProperty({ example: 'Morgana' })
  name!: string;

  @ApiProperty({ nullable: true, type: String })
  avatarUrl!: string | null;

  @ApiProperty({ enum: ['en', 'ua'], example: 'en' })
  locale!: Locale;

  @ApiProperty({ description: 'ISO timestamp' })
  createdAt!: string;

  @ApiProperty({ type: UserProfileDto })
  profile!: UserProfileDto;
}

/** PATCH /auth/profile — only the provided keys are updated. */
export class UpdateProfileDto implements UpdateProfileRequest {
  @ApiPropertyOptional({ nullable: true, type: String, example: '1990-07-23' })
  birthDate?: string | null;

  @ApiPropertyOptional({ enum: GENDERS, nullable: true })
  gender?: Gender | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  about?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  occupation?: string | null;

  @ApiPropertyOptional({ enum: RELATIONSHIP_STATUSES, nullable: true })
  relationshipStatus?: RelationshipStatus | null;

  @ApiPropertyOptional({ enum: FOCUS_AREAS, isArray: true })
  focusAreas?: FocusArea[];
}

export class AuthResponseDto implements AuthResponse {
  @ApiProperty({ description: 'JWT bearer token for Authorization headers' })
  token!: string;

  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}
