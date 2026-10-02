import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverController } from '../../controllers/fleet/driver.controller';
import { DriverRepository } from '../../repositories/fleet/driver.repository';
import { Driver, DriverSchema } from '../../schemas/fleet/driver.schema';
import { DriverService } from '../../services/fleet/driver.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }])],
  controllers: [DriverController],
  providers: [DriverRepository, DriverService],
  exports: [DriverRepository, DriverService],
})
export class DriverModule {}
