import { Module } from '@nestjs/common';
import { CardsModule } from '../cards/cards.module';
import { ReadingsService } from './readings.service';
import { InterpretationService } from './interpretation.service';
import { ReadingsController } from './readings.controller';

@Module({
  imports: [CardsModule],
  controllers: [ReadingsController],
  providers: [ReadingsService, InterpretationService],
})
export class ReadingsModule {}
