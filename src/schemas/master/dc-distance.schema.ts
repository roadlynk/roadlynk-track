import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DCDistanceDocument = DCDistance & Document;

@Schema({
  timestamps: true,
})
export class DCDistance {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  fromDelivery!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  toDelivery!: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 0 })
  calculatedDistance!: number;

  @Prop({ required: true, type: Number, min: 0 })
  companyDistance!: number;

  @Prop({ default: true })
  isActive!: boolean;
}

export const DCDistanceSchema = SchemaFactory.createForClass(DCDistance);

DCDistanceSchema.index(
  {
    companyId: 1,
    fromDelivery: 1,
    toDelivery: 1,
  },
  { unique: true, partialFilterExpression: { isActive: true } },
);
