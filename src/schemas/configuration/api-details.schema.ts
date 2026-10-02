import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Manufacturer } from '../fleet/truck.schema';

export type ApiDetailsDocument = ApiDetails & Document;

@Schema({ timestamps: true })
export class ApiDetails {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: Manufacturer,
    required: true,
  })
  manufacturer!: Manufacturer;

  @Prop({
    type: Map,
    of: String,
    required: true,
  })
  apiCredentials!: Map<string, string>;
}

export const ApiDetailsSchema = SchemaFactory.createForClass(ApiDetails);
ApiDetailsSchema.index({ manufacturer: 1, companyId: 1 }, { unique: true });