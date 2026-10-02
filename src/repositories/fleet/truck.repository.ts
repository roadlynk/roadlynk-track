import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTruckDto } from '../../dto/fleet/truck/create-truck.dto';
import { UpdateTruckDto } from '../../dto/fleet/truck/update-truck.dto';
import { Truck, TruckDocument } from '../../schemas/fleet/truck.schema';

@Injectable()
export class TruckRepository {
  constructor(
    @InjectModel(Truck.name)
    private readonly truckModel: Model<TruckDocument>,
  ) {}

  create(dto: CreateTruckDto) {
    return this.truckModel.create(dto);
  }

  findAll(companyId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.truckModel.find(filter).exec();
  }

  findByTruckNumbers(truckNumbers: string[], companyId: string) {
    return this.truckModel
      .find({ truckNumber: { $in: truckNumbers }, companyId })
      .exec();
  }

  findById(id: string) {
    return this.truckModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateTruckDto) {
    return this.truckModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }
}