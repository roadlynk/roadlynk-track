import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto } from '../../dto/master/client/create-client.dto';
import { UpdateClientDto } from '../../dto/master/client/update-client.dto';
import { Client, ClientDocument } from '../../schemas/master/client.schema';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  create(dto: CreateClientDto) {
    return this.clientModel.create(dto);
  }

  findAll(companyId?: string) {
    const filter: Record<string, any> = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    return this.clientModel.find(filter).exec();
  }

  findById(id: string) {
    return this.clientModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateClientDto) {
    return this.clientModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }
}
