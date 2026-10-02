import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from '../../controllers/fleet/company.controller';
import { CompanyRepository } from '../../repositories/fleet/company.repository';
import { Company, CompanySchema } from '../../schemas/fleet/company.schema';
import { CompanyService } from '../../services/fleet/company.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService],
  exports: [CompanyRepository, CompanyService],
})
export class CompanyModule {}
