import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TruckLocation } from '../../interfaces/truck-location.interface';
import {
  PushLocation,
  PushLocationDocument,
} from '../../schemas/location/push-location.schema';
import {
  EicherRawPush,
  EicherRawPushDocument,
} from '../../schemas/location/eicher-raw-push.schema';

@Injectable()
export class PushLocationRepository {
  constructor(
    @InjectModel(PushLocation.name)
    private readonly pushLocationModel: Model<PushLocationDocument>,
    @InjectModel(EicherRawPush.name)
    private readonly eicherRawPushModel: Model<EicherRawPushDocument>,
  ) {}

  createRawEicherPush(companyCode: string, payload: unknown) {
    return this.eicherRawPushModel.create({ companyCode, payload });
  }

  createPushLocationSnapshots(locations: TruckLocation[], companyId: Types.ObjectId) {
    if (locations.length === 0) {
      return Promise.resolve([]);
    }

    return this.pushLocationModel.insertMany(
      locations.map((location) => ({ ...location, companyId })),
    );
  }
}
