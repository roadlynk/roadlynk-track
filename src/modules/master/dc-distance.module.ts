import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DCDistanceController } from '../../controllers/master/dc-distance.controller';
import { DCDistanceRepository } from '../../repositories/master/dc-distance.repository';
import {
  DCDistance,
  DCDistanceSchema,
} from '../../schemas/master/dc-distance.schema';
import { DCDistanceService } from '../../services/master/dc-distance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DCDistance.name, schema: DCDistanceSchema },
    ]),
  ],
  controllers: [DCDistanceController],
  providers: [DCDistanceRepository, DCDistanceService],
  exports: [DCDistanceRepository, DCDistanceService],
})
export class DCDistanceModule {}
