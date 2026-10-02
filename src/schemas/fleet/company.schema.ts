import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({
  timestamps: true,
})
export class Company {
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
  })
  companyCode!: string;

  @Prop({
    required: true,
    trim: true,
  })
  companyName!: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  contactEmail!: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  contactNumber!: string;

  @Prop({
    default: 0,
  })
  lastDcSequence!: number;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

