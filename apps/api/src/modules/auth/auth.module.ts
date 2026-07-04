import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  // JwtModule is registered bare — AuthService passes the secret per call so a
  // missing JWT_SECRET only fails when auth is actually used (same lazy-env
  // pattern as InterpretationService).
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
