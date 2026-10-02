import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserContext, validateCompanyAccess } from '../../common/authorization/company-access.util';
import { CreateClientDto } from '../../dto/master/client/create-client.dto';
import { UpdateClientDto } from '../../dto/master/client/update-client.dto';
import { ClientRepository } from '../../repositories/master/client.repository';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  create(dto: CreateClientDto, user: AuthUserContext) {
    validateObjectId(dto.companyId, 'company id');
    validateCompanyAccess(user, dto.companyId);
    return this.clientRepository.create(dto).catch((error: unknown) => {
      this.throwIfDuplicateKey(error);
    });
  }

  findAll(companyId: string, user: AuthUserContext) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);
    return this.clientRepository.findAll(companyId);
  }

  async findById(id: string, user: AuthUserContext) {
    validateObjectId(id, 'client id');
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundException({
        message: `Client with id '${id}' not found`,
        error_code: errorCode.client.notFound,
      });
    }

    validateCompanyAccess(user, client.companyId);
    return client;
  }

  async updateById(id: string, dto: UpdateClientDto, user: AuthUserContext) {
    validateObjectId(id, 'client id');

    const existingClient = await this.clientRepository.findById(id);

    if (!existingClient) {
      throw new NotFoundException({
        message: `Client with id '${id}' not found`,
        error_code: errorCode.client.notFound,
      });
    }

    validateCompanyAccess(user, existingClient.companyId);

    try {
      return await this.clientRepository.updateById(id, dto);
    } catch (error) {
      this.throwIfDuplicateKey(error);
    }
  }

  private throwIfDuplicateKey(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException({
        message: 'Client code already exists for this company',
        error_code: errorCode.client.alreadyExists,
      });
    }

    throw error;
  }
}
