import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TruckController } from '../../controllers/fleet/truck.controller';
import { TruckRepository } from '../../repositories/fleet/truck.repository';
import { Truck, TruckSchema } from '../../schemas/fleet/truck.schema';
import { TruckService } from '../../services/fleet/truck.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Truck.name, schema: TruckSchema }])],
  controllers: [TruckController],
  providers: [TruckRepository, TruckService],
  exports: [TruckRepository],
})
export class TruckModule {}