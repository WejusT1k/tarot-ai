import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

/** `req.user` once the guard has run. */
export interface AuthedUser {
  userId: string;
  email: string;
}

export type AuthedRequest = Request & { user: AuthedUser };

/**
 * Bearer-token guard for routes that require a signed-in user (the AI
 * interpretation gate). Plain guard on top of AuthService — no passport.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) {
      throw new UnauthorizedException('Sign in to unlock your reading.');
    }

    const payload = await this.auth.verifyToken(token);
    (req as AuthedRequest).user = {
      userId: payload.sub,
      email: payload.email,
    };
    return true;
  }
}
