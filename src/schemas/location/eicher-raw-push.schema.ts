import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EicherRawPushDocument = EicherRawPush & Document;

@Schema({ timestamps: true, collection: 'eicher_raw_push', minimize: false })
export class EicherRawPush {
  @Prop({ type: String, required: true, index: true })
  companyCode!: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  payload!: unknown;
}

export const EicherRawPushSchema = SchemaFactory.createForClass(EicherRawPush);