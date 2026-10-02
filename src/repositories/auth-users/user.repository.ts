import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/auth-users/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(userData: Record<string, any>) {
    return this.userModel.create(userData);
  }

  findByEmail(email: string) {
    return this.userModel
      .findOne({ email: email.trim().toLowerCase() })
      .exec();
  }

  findByEmailWithPassword(email: string) {
    return this.userModel
      .findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash')
      .exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  updatePassword(id: string, passwordHash: string) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          passwordHash,
          $inc: { tokenVersion: 1 },
        },
        { new: true },
      )
      .exec();
  }

  updateById(id: string, updateData: Record<string, any>) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: updateData,
          $inc: { tokenVersion: 1 },
        },
        { new: true, runValidators: true },
      )
      .exec();
  }

  revokeTokens(id: string) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { tokenVersion: 1 },
        },
        { new: true },
      )
      .exec();
  }

  findByCompanyId(companyId: string) {
    return this.userModel.findOne({ companyId }).exec();
  }

  updateManyByCompanyId(companyId: string, updateData: Record<string, any>) {
    return this.userModel
      .updateMany(
        { companyId },
        {
          $set: updateData,
          $inc: { tokenVersion: 1 },
        },
      )
      .exec();
  }

  findAll(companyId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.userModel.find(filter).exec();
  }
}
