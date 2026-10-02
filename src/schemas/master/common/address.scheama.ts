import { Prop, Schema } from '@nestjs/mongoose';

export enum AddressType {
  PINCODE = 'PINCODE',
  COORDINATES = 'COORDINATES',
}


@Schema({ _id: false })
export class AddressPincode {
  @Prop({
    required: true,
    trim: true,
  })
  pincode!: string;

  @Prop({
    required: true,
    trim: true,
  })
  state!: string;

  @Prop({
    required: true,
    trim: true,
  })
  district!: string;

  @Prop({
    required: true,
    trim: true,
  })
  town!: string;

  @Prop({
    required: true,
    trim: true,
  })
  fullAddress!: string;
}

@Schema({ _id: false })
export class AddressCoordinates {
  @Prop({
    required: true,
    type: Number,
  })
  latitude!: number;

  @Prop({
    required: true,
    type: Number,
  })
  longitude!: number;

  @Prop({
    required: true,
    trim: true,
  })
  fullAddress!: string;
}

@Schema({ _id: false })
export class Address {
  @Prop({
    type: String,
    enum: AddressType,
    required: true,
  })
  type!: AddressType;

  @Prop({ type: AddressPincode })
  pincodeAddress?: AddressPincode;

  @Prop({ type: AddressCoordinates })
  coordinatesAddress?: AddressCoordinates;
}

