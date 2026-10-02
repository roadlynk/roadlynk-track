import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDCDistanceDto } from '../../dto/master/dc-distance/create-dc-distance.dto';
import { UpdateDCDistanceDto } from '../../dto/master/dc-distance/update-dc-distance.dto';
import {
  DCDistance,
  DCDistanceDocument,
} from '../../schemas/master/dc-distance.schema';

@Injectable()
export class DCDistanceRepository {
  constructor(
    @InjectModel(DCDistance.name)
    private readonly dcDistanceModel: Model<DCDistanceDocument>,
  ) {}

  create(dto: CreateDCDistanceDto) {
    return this.dcDistanceModel.create(dto);
  }

  findAll(companyId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.dcDistanceModel.find(filter).exec();
  }

  findById(id: string) {
    return this.dcDistanceModel.findById(id).exec();
  }

  findDistance(companyId: string, fromDelivery: string, toDelivery: string) {
    return this.dcDistanceModel
      .findOne({ companyId, fromDelivery, toDelivery })
      .exec();
  }

  updateById(id: string, dto: UpdateDCDistanceDto) {
    return this.dcDistanceModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }
}
