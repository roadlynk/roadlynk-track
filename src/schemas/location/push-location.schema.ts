import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Manufacturer } from '../fleet/truck.schema';

export type PushLocationDocument = PushLocation & Document;

@Schema({ timestamps: true, collection: 'push_location' })
export class PushLocation {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId!: Types.ObjectId;

  @Prop({ required: true, trim: true, uppercase: true })
  truckNumber!: string;

  @Prop({ required: true, type: String, enum: Manufacturer })
  manufacturer!: Manufacturer;

  @Prop({ type: Number, default: null })
  latitude!: number | null;

  @Prop({ type: Number, default: null })
  longitude!: number | null;

  @Prop({ type: Number, default: null })
  odometer!: number | null;

  @Prop({ type: String, default: null })
  vehicleStatus!: string | null;

  @Prop({ type: Number, default: null })
  speed!: number | null;

  @Prop({ type: Date, required: true, default: Date.now })
  capturedAt!: Date;
}

export const PushLocationSchema = SchemaFactory.createForClass(PushLocation);
PushLocationSchema.index({ companyId: 1, truckNumber: 1, capturedAt: -1 });