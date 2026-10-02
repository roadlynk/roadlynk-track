import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeliveryDto } from '../../dto/master/delivery/create-delivery.dto';
import { UpdateDeliveryDto } from '../../dto/master/delivery/update-delivery.dto';
import {
  Delivery,
  DeliveryDocument,
} from '../../schemas/master/delivery.schema';

@Injectable()
export class DeliveryRepository {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: Model<DeliveryDocument>,
  ) {}

  create(dto: CreateDeliveryDto) {
    return this.deliveryModel.create(dto);
  }

  existsByCompanyClientAndCode(
    companyId: string,
    clientId: string,
    code: string,
    excludeId?: string,
  ) {
    const filter: Record<string, any> = { companyId, clientId, code };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return this.deliveryModel.exists(filter);
  }

  findAll(companyId?: string, clientId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    if (clientId) {
      filter.clientId = clientId;
    }
    return this.deliveryModel.find(filter).exec();
  }

  findById(id: string) {
    return this.deliveryModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateDeliveryDto) {
    return this.deliveryModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }
}
