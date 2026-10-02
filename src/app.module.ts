import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TruckModule } from './modules/fleet/truck.module';
import { DriverModule } from './modules/fleet/driver.module';
import { ClientModule } from './modules/master/client.module';
import { DeliveryModule } from './modules/master/delivery.module';
import { DCDistanceModule } from './modules/master/dc-distance.module';
import { ApiDetailsModule } from './modules/configuration/api-details.module';
import { CompanyModule } from './modules/fleet/company.module';
import { HttpClientModule } from './modules/configuration/http-client.module';
import { UserModule } from './modules/auth-users/user.module';
import { LocationModule } from './modules/location/location.module';
import { HealthController } from './controllers/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpClientModule,

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule,
    LocationModule,
    TruckModule,
    DriverModule,
    ClientModule,
    DeliveryModule,
    DCDistanceModule,
    CompanyModule,
    ApiDetailsModule,
  ],
})
export class AppModule {}
