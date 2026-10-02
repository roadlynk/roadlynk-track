import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryController } from '../../controllers/master/delivery.controller';
import { DeliveryRepository } from '../../repositories/master/delivery.repository';
import {
  Delivery,
  DeliverySchema,
} from '../../schemas/master/delivery.schema';
import { DeliveryService } from '../../services/master/delivery.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryRepository, DeliveryService],
  exports: [DeliveryRepository, DeliveryService],
})
export class DeliveryModule {}
