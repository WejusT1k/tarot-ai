import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  FOCUS_AREAS,
  GENDERS,
  RELATIONSHIP_STATUSES,
  type AuthResponse,
  type UpdateProfileRequest,
  type User,
} from '@tarot-ai/types';
import { AuthService } from './auth.service';
import { JwtAuthGuard, type AuthedRequest } from './jwt-auth.guard';
import {
  AuthResponseDto,
  LoginDto,
  PublicUserDto,
  RegisterDto,
  UpdateProfileDto,
} from './auth.dto';

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;
// Deliberately loose — just "something@something.tld"; the email is the login
// key, not a deliverability guarantee.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_ABOUT_LENGTH = 600;
const MAX_OCCUPATION_LENGTH = 120;
const MIN_BIRTH_YEAR = 1900;
const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create an email + password account' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'Email already registered.' })
  register(@Body() body: RegisterDto): Promise<AuthResponse> {
    const name = body?.name?.trim() ?? '';
    const email = body?.email?.trim() ?? '';
    const password = body?.password ?? '';

    if (name.length < MIN_NAME_LENGTH) {
      throw new BadRequestException(
        `Tell us your name — at least ${MIN_NAME_LENGTH} characters.`,
      );
    }
    if (!EMAIL_PATTERN.test(email)) {
      throw new BadRequestException('That email does not look right.');
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(
        `Choose a stronger password — at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
    }

    return this.auth.register(name, email, password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in with email + password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Wrong email or password.' })
  login(@Body() body: LoginDto): Promise<AuthResponse> {
    const email = body?.email?.trim() ?? '';
    const password = body?.password ?? '';

    if (!email || !password) {
      throw new BadRequestException('Enter your email and password.');
    }

    return this.auth.login(email, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'The signed-in user for the presented token' })
  @ApiOkResponse({ type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: 'Missing / invalid token.' })
  me(@Req() req: AuthedRequest): Promise<User> {
    return this.auth.me(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Update the seeker's profile (all fields voluntary; only provided keys change)",
  })
  @ApiOkResponse({ type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: 'Missing / invalid token.' })
  updateProfile(
    @Req() req: AuthedRequest,
    @Body() body: UpdateProfileDto,
  ): Promise<User> {
    const changes: UpdateProfileRequest = {};

    if (body?.birthDate !== undefined) {
      changes.birthDate = this.parseBirthDate(body.birthDate);
    }

    if (body?.gender !== undefined) {
      if (body.gender !== null && !GENDERS.includes(body.gender)) {
        throw new BadRequestException('Unknown gender value.');
      }
      changes.gender = body.gender;
    }

    if (body?.about !== undefined) {
      const about = body.about?.trim() || null;
      if (about && about.length > MAX_ABOUT_LENGTH) {
        throw new BadRequestException(
          `Keep your story under ${MAX_ABOUT_LENGTH} characters.`,
        );
      }
      changes.about = about;
    }

    if (body?.occupation !== undefined) {
      const occupation = body.occupation?.trim() || null;
      if (occupation && occupation.length > MAX_OCCUPATION_LENGTH) {
        throw new BadRequestException(
          `Keep your occupation under ${MAX_OCCUPATION_LENGTH} characters.`,
        );
      }
      changes.occupation = occupation;
    }

    if (body?.relationshipStatus !== undefined) {
      if (
        body.relationshipStatus !== null &&
        !RELATIONSHIP_STATUSES.includes(body.relationshipStatus)
      ) {
        throw new BadRequestException('Unknown relationship status.');
      }
      changes.relationshipStatus = body.relationshipStatus;
    }

    if (body?.focusAreas !== undefined) {
      if (
        !Array.isArray(body.focusAreas) ||
        body.focusAreas.some((area) => !FOCUS_AREAS.includes(area))
      ) {
        throw new BadRequestException('Unknown focus area.');
      }
      // De-dupe, keep the canonical order.
      changes.focusAreas = FOCUS_AREAS.filter((area) =>
        body.focusAreas!.includes(area),
      );
    }

    return this.auth.updateProfile(req.user.userId, changes);
  }

  /** 'YYYY-MM-DD', a real calendar date, between 1900 and today (or null). */
  private parseBirthDate(value: string | null): string | null {
    if (value === null || value === '') return null;

    if (!BIRTH_DATE_PATTERN.test(value)) {
      throw new BadRequestException('Birth date must be YYYY-MM-DD.');
    }
    const date = new Date(`${value}T00:00:00Z`);
    const [year] = value.split('-').map(Number);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException('That birth date does not exist.');
    }
    if (year < MIN_BIRTH_YEAR || date.getTime() > Date.now()) {
      throw new BadRequestException(
        'Birth date must be in the past (and after 1900).',
      );
    }
    return value;
  }
}
