import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserContext, validateCompanyAccess } from '../../common/authorization/company-access.util';
import { CreateDriverDto } from '../../dto/fleet/driver/create-driver.dto';
import { UpdateDriverDto } from '../../dto/fleet/driver/update-driver.dto';
import { DriverRepository } from '../../repositories/fleet/driver.repository';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  create(dto: CreateDriverDto, user: AuthUserContext) {
    validateObjectId(dto.companyId, 'company id');
    validateCompanyAccess(user, dto.companyId);
    return this.driverRepository.create(dto).catch((error: unknown) => {
      this.throwIfDuplicateKey(error);
    });
  }

  findAll(companyId: string, user: AuthUserContext) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);
    return this.driverRepository.findAll(companyId);
  }

  async findById(id: string, user: AuthUserContext) {
    validateObjectId(id, 'driver id');
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new NotFoundException({
        message: `Driver with id '${id}' not found`,
        error_code: errorCode.driver.notFound,
      });
    }

    validateCompanyAccess(user, driver.companyId);
    return driver;
  }

  async updateById(id: string, dto: UpdateDriverDto, user: AuthUserContext) {
    validateObjectId(id, 'driver id');

    const existingDriver = await this.driverRepository.findById(id);

    if (!existingDriver) {
      throw new NotFoundException({
        message: `Driver with id '${id}' not found`,
        error_code: errorCode.driver.notFound,
      });
    }

    validateCompanyAccess(user, existingDriver.companyId);

    try {
      return await this.driverRepository.updateById(id, dto);
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
        message: 'Driver licence number or mobile number already exists for this company',
        error_code: errorCode.driver.alreadyExists,
      });
    }

    throw error;
  }
}
