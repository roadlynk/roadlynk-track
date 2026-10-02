import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateApiDetailsDto } from '../../dto/configuration/api-details/create-api-details.dto';
import { UpdateApiDetailsDto } from '../../dto/configuration/api-details/update-api-details.dto';
import { Manufacturer } from '../../schemas/fleet/truck.schema';
import { ApiDetailsDocument, ApiDetails } from '../../schemas/configuration/api-details.schema';

@Injectable()
export class ApiDetailsRepository {
  constructor(
    @InjectModel(ApiDetails.name)
    private readonly apiDetailsModel: Model<ApiDetailsDocument>,
  ) {}

  create(dto: CreateApiDetailsDto) {
    return this.apiDetailsModel.create(dto);
  }

  findAll(companyId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.apiDetailsModel.find(filter).exec();
  }

  findByManufacturer(manufacturer: Manufacturer, companyId?: string) {
    const filter: Record<string, any> = { manufacturer };
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.apiDetailsModel.findOne(filter).exec();
  }

  findByManufacturerAndCompany(manufacturer: Manufacturer, companyId: string) {
    return this.apiDetailsModel.findOne({ manufacturer, companyId }).exec();
  }

  findById(id: string) {
    return this.apiDetailsModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateApiDetailsDto) {
    return this.apiDetailsModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }
}