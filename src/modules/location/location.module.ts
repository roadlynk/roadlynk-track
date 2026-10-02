import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from '../../controllers/location/location.controller';
import { ApiDetailsModule } from '../configuration/api-details.module';
import { CompanyModule } from '../fleet/company.module';
import { TruckModule } from '../fleet/truck.module';
import { EicherPullService } from '../../services/manufacturer/eicher/eicher-pull.service';
import { LocationService } from '../../services/location/location.service';
import { LocationCronService } from '../../services/location/location-cron.service';
import { PullLocationRepository } from '../../repositories/location/pull-location.repository';
import { PushLocationRepository } from '../../repositories/location/push-location.repository';
import { EicherPushController } from '../../controllers/location/manufacturer/eicher/eicher-push.controller';
import { EicherPushService } from '../../services/manufacturer/eicher/eicher-push.service';
import {
  PullLocation,
  PullLocationSchema,
} from '../../schemas/location/pull-location.schema';
import {
  PushLocation,
  PushLocationSchema,
} from '../../schemas/location/push-location.schema';
import {
  EicherRawPush,
  EicherRawPushSchema,
} from '../../schemas/location/eicher-raw-push.schema';

@Module({
  imports: [
    ApiDetailsModule,
    CompanyModule,
    TruckModule,
    MongooseModule.forFeature([
      { name: PullLocation.name, schema: PullLocationSchema },
      { name: PushLocation.name, schema: PushLocationSchema },
      { name: EicherRawPush.name, schema: EicherRawPushSchema },
    ]),
  ],
  controllers: [LocationController, EicherPushController],
  providers: [
    EicherPullService,
    EicherPushService,
    LocationService,
    LocationCronService,
    PullLocationRepository,
    PushLocationRepository,
  ],
})
export class LocationModule {}
