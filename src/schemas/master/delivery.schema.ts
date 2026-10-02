import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Address } from './common/address.scheama';
export type DeliveryDocument = Delivery & Document;

export enum DeliveryType {
  DEALER = 'DEALER',
  COMPANY = 'COMPANY',
  GODOWN = 'GODOWN',
}

@Schema({ timestamps: true })
export class Delivery {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true,
  })
  clientId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  deliveryName!: string;

  @Prop({ required: true, trim: true })
  code!: string;

  @Prop({ type: Address, required: true })
  address!: Address;

  @Prop({
    type: String,
    enum: DeliveryType,
  })
  deliveryType!: DeliveryType;

  @Prop({ default: true })
  isActive!: boolean;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
DeliverySchema.index(
  { companyId: 1, clientId: 1, code: 1 },
  { unique: true },
);