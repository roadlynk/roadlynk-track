import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TruckLocation } from '../../interfaces/truck-location.interface';
import {
  PushLocation,
  PushLocationDocument,
} from '../../schemas/location/push-location.schema';

@Injectable()
export class PushLocationRepository {
  constructor(
    @InjectModel(PushLocation.name)
    private readonly pushLocationModel: Model<PushLocationDocument>,
  ) {}

  createPushLocationSnapshots(locations: TruckLocation[], companyId: Types.ObjectId) {
    if (locations.length === 0) {
      return Promise.resolve([]);
    }

    return this.pushLocationModel.insertMany(
      locations.map((location) => ({ ...location, companyId })),
    );
  }
}
