import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TruckLocation } from '../../interfaces/truck-location.interface';
import {
  PullLocation,
  PullLocationDocument,
} from '../../schemas/location/pull-location.schema';

@Injectable()
export class PullLocationRepository {
  constructor(
    @InjectModel(PullLocation.name)
    private readonly pullLocationModel: Model<PullLocationDocument>,
  ) {}

  createSnapshots(companyId: string, locations: TruckLocation[]) {
    if (locations.length === 0) {
      return Promise.resolve([]);
    }

    const companyObjectId = new Types.ObjectId(companyId);
    const savedAt = new Date();

    return this.pullLocationModel.insertMany(
      locations.map((location) => ({
        ...location,
        companyId: companyObjectId,
        capturedAt: location.capturedAt ?? savedAt,
      })),
    );
  }
}
