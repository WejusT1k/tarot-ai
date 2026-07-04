import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CardsModule } from '../cards/cards.module';
import { ReadingsService } from './readings.service';
import { InterpretationService } from './interpretation.service';
import { ReadingsController } from './readings.controller';

@Module({
  // AuthModule provides JwtAuthGuard for the interpret gate.
  imports: [AuthModule, CardsModule],
  controllers: [ReadingsController],
  providers: [ReadingsService, InterpretationService],
})
export class ReadingsModule {}
