import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {
  ConflictException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  // Loose repository stand-in — Repository#save's overloads defeat jest.Mocked.
  let users: {
    findOne: jest.Mock;
    save: jest.Mock<Promise<User>, [Partial<User>]>;
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    users = {
      findOne: jest.fn(),
      save: jest.fn(
        (data: Partial<User>) =>
          Promise.resolve({ ...data, createdAt: new Date() }) as Promise<User>,
      ),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: users },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('register', () => {
    it('creates the account and returns a token + public user', async () => {
      users.findOne.mockResolvedValue(null);

      const result = await service.register(
        'Morgana',
        ' Seeker@Example.COM ',
        'correct-horse',
      );

      expect(result.token).toBeTruthy();
      // Email is normalized, hash never leaks into the public user.
      expect(result.user.email).toBe('seeker@example.com');
      expect(result.user).not.toHaveProperty('passwordHash');
      const saved = users.save.mock.calls[0][0];
      expect(saved.passwordHash).not.toBe('correct-horse');
    });

    it('rejects an already-registered email with 409', async () => {
      users.findOne.mockResolvedValue({ id: 'x' });

      await expect(
        service.register('Morgana', 'seeker@example.com', 'correct-horse'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('signs in with the right password (case-insensitive email)', async () => {
      const { user } = await registerFixture();

      const result = await service.login('SEEKER@example.com', 'correct-horse');

      expect(result.user.id).toBe(user.id);
      expect(result.token).toBeTruthy();
    });

    it('rejects a wrong password with 401', async () => {
      await registerFixture();

      await expect(
        service.login('seeker@example.com', 'wrong-horse'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an unknown email with the same 401', async () => {
      users.findOne.mockResolvedValue(null);

      await expect(
        service.login('nobody@example.com', 'whatever-pass'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    it('round-trips a token issued by register', async () => {
      users.findOne.mockResolvedValue(null);
      const { token, user } = await service.register(
        'Morgana',
        'seeker@example.com',
        'correct-horse',
      );

      const payload = await service.verifyToken(token);

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe('seeker@example.com');
    });

    it('rejects garbage with 401', async () => {
      await expect(service.verifyToken('not-a-jwt')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('fails with 503 when JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;

      await expect(service.verifyToken('anything')).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
    });
  });

  /** Register once, then make findOne serve that stored user for login tests. */
  async function registerFixture() {
    users.findOne.mockResolvedValue(null);
    const result = await service.register(
      'Morgana',
      'seeker@example.com',
      'correct-horse',
    );
    const stored = users.save.mock.calls[0][0] as User;
    users.findOne.mockResolvedValue({
      ...stored,
      createdAt: new Date(),
    });
    return result;
  }
});
