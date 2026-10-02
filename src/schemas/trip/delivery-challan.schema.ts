import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeliveryChallanDocument = DeliveryChallan & Document;

@Schema({ _id: false })
export class DoubleDC {
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
  })
  dcNumber!: string;

  @Prop({
    default: false,
  })
  isE2E!: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
  })
  deliveryFromClientId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'DeliveryChallan',
    required: true,
  })
  linkedDeliveryChallanId!: Types.ObjectId;
}

export const DoubleDCSchema = SchemaFactory.createForClass(DoubleDC);

@Schema({ _id: false })
export class CompanyDetails {
  @Prop({
    required: true,
    trim: true,
  })
  invoice!: string;

  @Prop({
    required: true,
    trim: true,
  })
  shipmentNumber!: string;

  @Prop({
    type: Date,
    required: true,
  })
  date!: Date;
}

export const CompanyDetailsSchema = SchemaFactory.createForClass(CompanyDetails);

@Schema({ _id: false })
export class Consignment {
  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  consignorId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  consignerBranchId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  consigneeId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  consigneeBranchId!: Types.ObjectId;
}

export const ConsignmentSchema = SchemaFactory.createForClass(Consignment);

@Schema({ _id: false })
export class DeliveryDetails {
  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  invoiceDeliveryId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  shipToDeliveryId!: Types.ObjectId;

  @Prop({
    default: false,
  })
  isSame!: boolean;
}

export const DeliveryDetailsSchema = SchemaFactory.createForClass(DeliveryDetails);

@Schema({ _id: false })
export class DistanceDetails {
  @Prop({
    type: Number,
    min: 0,
    default: 0,
  })
  odometerDistance?: number;

  @Prop({
    type: Number,
    min: 0,
    default: 0,
  })
  calculatedDistance?: number;

  @Prop({
    type: Number,
    min: 0,
    default: 0,
  })
  companyDistance?: number;
}

export const DistanceDetailsSchema = SchemaFactory.createForClass(DistanceDetails);

@Schema({ _id: false })
export class TruckDetails {
  @Prop({
    type: Types.ObjectId,
    ref: 'Truck',
    required: true,
  })
  truckId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Driver',
    required: true,
  })
  driverId!: Types.ObjectId;
}

export const TruckDetailsSchema = SchemaFactory.createForClass(TruckDetails);

@Schema({ _id: false })
export class AdditionalInformation {

  @Prop({
    trim: true,
  })
  notes?: string;
}

export const AdditionalInformationSchema =
  SchemaFactory.createForClass(AdditionalInformation);

@Schema({
  timestamps: true,
})
export class DeliveryChallan {
  @Prop({
    type: DoubleDCSchema,
  })
  doubleDC?: DoubleDC;

  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
  })
  dcNumber!: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  dcDate?: Date;

  @Prop({
    type: CompanyDetailsSchema,
    required: true,
  })
  companyDetails!: CompanyDetails;

  @Prop({
    type: ConsignmentSchema,
    required: true,
  })
  consignment!: Consignment;

  @Prop({
    type: TruckDetailsSchema,
    required: true,
  })
  truckDetails!: TruckDetails;

  @Prop({
    type: DeliveryDetailsSchema,
    required: true,
  })
  deliveryDetails!: DeliveryDetails;

  @Prop({
    type: DistanceDetailsSchema,
    required: true,
  })
  distance!: DistanceDetails;

  @Prop({
    type: AdditionalInformationSchema,
    default: {},
  })
  additionalInformation?: AdditionalInformation;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const DeliveryChallanSchema = SchemaFactory.createForClass(DeliveryChallan);
DeliveryChallanSchema.index({ companyId: 1, dcNumber: 1 }, { unique: true });
