import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT_USER',
  CLIENT_ADMIN = 'CLIENT_ADMIN'
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_doc, ret: Record<string, unknown>) {
      delete ret['passwordHash'];
      delete ret['__v'];
      return ret;
    },
  },
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  username?: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email?: string;

  @Prop({
    required: true,
    select: false,
  })
  passwordHash!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    index: true,
  })
  companyId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: UserRole,
    required: false,
  })
  userRole?: UserRole;

  @Prop({
    type: Number,
    default: 1,
  })
  tokenVersion!: number;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ companyId: 1, email: 1 }, { unique: true });