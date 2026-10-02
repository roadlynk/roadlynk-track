import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiDetailsController } from '../../controllers/configuration/api-details.controller';
import { ApiDetailsRepository } from '../../repositories/configuration/api-details.repository';
import { ApiDetailsService } from '../../services/configuration/api-details.service';
import {
  ApiDetails,
  ApiDetailsSchema,
} from '../../schemas/configuration/api-details.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiDetails.name, schema: ApiDetailsSchema },
    ]),
  ],
  controllers: [ApiDetailsController],
  providers: [ApiDetailsRepository, ApiDetailsService],
  exports: [ApiDetailsService],
})
export class ApiDetailsModule {}