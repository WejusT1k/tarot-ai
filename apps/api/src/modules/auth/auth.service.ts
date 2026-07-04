import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import type {
  AuthResponse,
  UpdateProfileRequest,
  User as PublicUser,
} from '@tarot-ai/types';
import { User } from './user.entity';

/** What we sign into the token — enough to identify the user without a DB hit. */
export interface JwtPayload {
  sub: string; // user id
  email: string;
}

const BCRYPT_ROUNDS = 10;
const TOKEN_TTL = '7d';

/**
 * Email + password accounts and JWT bearer tokens. Stateless — no refresh
 * tokens / sessions; a 7-day access token is enough for the interpret gate.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  /** Lazily read the secret so a missing one only fails when auth is used. */
  private secret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ServiceUnavailableException(
        'Auth is not configured (missing JWT_SECRET).',
      );
    }
    return secret;
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const normalized = email.trim().toLowerCase();

    const existing = await this.users.findOne({
      where: { email: normalized },
    });
    if (existing) {
      throw new ConflictException(
        'An account with this email already exists — sign in instead.',
      );
    }

    const user = await this.users.save({
      id: randomUUID(),
      email: normalized,
      name: name.trim(),
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      avatarUrl: null,
      locale: 'en' as const,
      // Profile starts empty — filled in later via PATCH /auth/profile.
      birthDate: null,
      gender: null,
      about: null,
      occupation: null,
      relationshipStatus: null,
      focusAreas: [],
    });

    return { token: await this.sign(user), user: this.toPublicUser(user) };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.users.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    // Same error for unknown email and wrong password — don't leak which.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Wrong email or password.');
    }

    return { token: await this.sign(user), user: this.toPublicUser(user) };
  }

  /** Verify a bearer token; throws 401 on anything invalid or expired. */
  async verifyToken(token: string): Promise<JwtPayload> {
    // Outside the try — a missing JWT_SECRET must surface as 503, not 401.
    const secret = this.secret();
    try {
      return await this.jwt.verifyAsync<JwtPayload>(token, { secret });
    } catch {
      throw new UnauthorizedException(
        'Your session has expired — sign in again.',
      );
    }
  }

  /** The current user for GET /auth/me (token already verified by the guard). */
  async me(userId: string): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('This account no longer exists.');
    }
    return this.toPublicUser(user);
  }

  /**
   * Apply the provided profile keys (values already validated by the
   * controller) and return the refreshed public user.
   */
  async updateProfile(
    userId: string,
    changes: UpdateProfileRequest,
  ): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('This account no longer exists.');
    }

    if (changes.birthDate !== undefined) user.birthDate = changes.birthDate;
    if (changes.gender !== undefined) user.gender = changes.gender;
    if (changes.about !== undefined) user.about = changes.about;
    if (changes.occupation !== undefined) user.occupation = changes.occupation;
    if (changes.relationshipStatus !== undefined) {
      user.relationshipStatus = changes.relationshipStatus;
    }
    if (changes.focusAreas !== undefined) user.focusAreas = changes.focusAreas;

    return this.toPublicUser(await this.users.save(user));
  }

  private sign(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwt.signAsync(payload, {
      secret: this.secret(),
      expiresIn: TOKEN_TTL,
    });
  }

  /** Strip the password hash; serialize dates for the shared `User` type. */
  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
      profile: {
        birthDate: user.birthDate,
        gender: user.gender,
        about: user.about,
        occupation: user.occupation,
        relationshipStatus: user.relationshipStatus,
        focusAreas: user.focusAreas ?? [],
      },
    };
  }
}
