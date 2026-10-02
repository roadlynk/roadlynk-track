import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserContext, validateCompanyAccess } from '../../common/authorization/company-access.util';
import { CreateTruckDto } from '../../dto/fleet/truck/create-truck.dto';
import { UpdateTruckDto } from '../../dto/fleet/truck/update-truck.dto';
import { TruckRepository } from '../../repositories/fleet/truck.repository';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';

@Injectable()
export class TruckService {
  constructor(private readonly truckRepository: TruckRepository) {}

  create(dto: CreateTruckDto, user: AuthUserContext) {
    validateObjectId(dto.companyId, 'company id');
    validateCompanyAccess(user, dto.companyId);
    return this.truckRepository.create(dto).catch((error: unknown) => {
      this.throwIfDuplicateKey(error);
    });
  }

  findAll(companyId: string, user: AuthUserContext) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);
    return this.truckRepository.findAll(companyId);
  }

  async findById(id: string, user: AuthUserContext) {
    validateObjectId(id, 'truck id');
    const truck = await this.truckRepository.findById(id);

    if (!truck) {
      throw new NotFoundException({
        message: `Truck with id '${id}' not found`,
        error_code: errorCode.truck.notFound,
      });
    }

    validateCompanyAccess(user, truck.companyId);
    return truck;
  }

  async updateById(id: string, dto: UpdateTruckDto, user: AuthUserContext) {
    validateObjectId(id, 'truck id');

    const existingTruck = await this.truckRepository.findById(id);

    if (!existingTruck) {
      throw new NotFoundException({
        message: `Truck with id '${id}' not found`,
        error_code: errorCode.truck.notFound,
      });
    }

    validateCompanyAccess(user, existingTruck.companyId);

    try {
      return await this.truckRepository.updateById(id, dto);
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
        message: 'Truck number or chassis number already exists for this company',
        error_code: errorCode.truck.alreadyExists,
      });
    }

    throw error;
  }
}