import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from '../../dto/fleet/company/create-company.dto';
import { UpdateCompanyDto } from '../../dto/fleet/company/update-company.dto';
import { Company, CompanyDocument } from '../../schemas/fleet/company.schema';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  create(dto: CreateCompanyDto) {
    return this.companyModel.create(dto);
  }

  findAll() {
    return this.companyModel.find().exec();
  }

  findById(id: string) {
    return this.companyModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateCompanyDto) {
    return this.companyModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }

  findByCompanyCode(companyCode: string) {
    return this.companyModel
      .findOne({
        companyCode: companyCode.trim().toUpperCase(),
        isActive: true,
      })
      .exec();
  }
}