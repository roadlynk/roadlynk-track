import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDriverDto } from '../../dto/fleet/driver/create-driver.dto';
import { UpdateDriverDto } from '../../dto/fleet/driver/update-driver.dto';
import { Driver, DriverDocument } from '../../schemas/fleet/driver.schema';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,
  ) {}

  create(dto: CreateDriverDto) {
    return this.driverModel.create(dto);
  }

  findAll(companyId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.driverModel.find(filter).exec();
  }

  findById(id: string) {
    return this.driverModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateDriverDto) {
    return this.driverModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }
}
