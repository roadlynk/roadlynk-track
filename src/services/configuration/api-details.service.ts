import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiDetailsRepository } from '../../repositories/configuration/api-details.repository';
import { CreateApiDetailsDto } from '../../dto/configuration/api-details/create-api-details.dto';
import { UpdateApiDetailsDto } from '../../dto/configuration/api-details/update-api-details.dto';
import { Manufacturer } from '../../schemas/fleet/truck.schema';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';
import {
  AuthUserContext,
  validateCompanyAccess,
} from '../../common/authorization/company-access.util';

@Injectable()
export class ApiDetailsService {
  constructor(private readonly apiDetailsRepository: ApiDetailsRepository) {}

  async create(dto: CreateApiDetailsDto, user: AuthUserContext) {
    validateObjectId(dto.companyId, 'company id');
    validateCompanyAccess(user, dto.companyId);
    
    this.validateCredentials(dto.apiCredentials);

    try {
      return await this.apiDetailsRepository.create(dto);
    } catch (error) {
      this.throwIfDuplicateManufacturer(error);
    }
  }

  findAll(companyId: string, user: AuthUserContext) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);

    return this.apiDetailsRepository.findAll(companyId);
  }

  async findByManufacturerAndCompany(
    manufacturer: Manufacturer,
    companyId: string,
    user: AuthUserContext,
  ) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);
    

    const apiDetails =
      await this.apiDetailsRepository.findByManufacturerAndCompany(
        manufacturer,
        companyId,
      );

    if (!apiDetails) {
      throw new NotFoundException({
        message: `API details for manufacturer '${manufacturer}' and company '${companyId}' not found`,
        error_code: errorCode.apiDetails.notFound,
      });
    }

    return apiDetails;
  }

  async updateById(
    id: string,
    dto: UpdateApiDetailsDto,
    user: AuthUserContext,
  ) {
    validateObjectId(id, 'API details id');

    const existingApiDetails = await this.apiDetailsRepository.findById(id);
    if (!existingApiDetails) {
      throw new NotFoundException({
        message: `API details with id '${id}' not found`,
        error_code: errorCode.apiDetails.notFound,
      });
    }

    validateCompanyAccess(user, existingApiDetails.companyId);

    if (dto.apiCredentials !== undefined) {
      this.validateCredentials(dto.apiCredentials);
    }

    try {
      return await this.apiDetailsRepository.updateById(id, dto);
    } catch (error) {
      this.throwIfDuplicateManufacturer(error);
    }
  }

  private validateCredentials(credentials: unknown) {
    if (
      typeof credentials !== 'object' ||
      credentials === null ||
      Array.isArray(credentials) ||
      Object.keys(credentials).length === 0 ||
      Object.values(credentials).some((value) => typeof value !== 'string')
    ) {
      throw new BadRequestException({
        message: 'apiCredentials must be a non-empty object of string values',
        error_code: errorCode.apiDetails.invalidCredentials,
      });
    }
  }

  private throwIfDuplicateManufacturer(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException({
        message: 'API details already exist for this manufacturer and company',
        error_code: errorCode.apiDetails.alreadyExists,
      });
    }

    throw error;
  }
}