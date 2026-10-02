import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AuthUserContext,
  validateCompanyAccess,
} from '../../common/authorization/company-access.util';
import { CreateDCDistanceDto } from '../../dto/master/dc-distance/create-dc-distance.dto';
import { UpdateDCDistanceDto } from '../../dto/master/dc-distance/update-dc-distance.dto';
import { GetDistanceDto } from '../../dto/master/dc-distance/get-distance.dto';
import { DCDistanceRepository } from '../../repositories/master/dc-distance.repository';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';

@Injectable()
export class DCDistanceService {
  constructor(private readonly dcDistanceRepository: DCDistanceRepository) {}

  create(dto: CreateDCDistanceDto, user: AuthUserContext) {
    validateObjectId(dto.companyId, 'company id');
    validateObjectId(dto.fromDelivery, 'from delivery id');
    validateObjectId(dto.toDelivery, 'to delivery id');
    validateCompanyAccess(user, dto.companyId);

    return this.dcDistanceRepository.create(dto).catch((error: unknown) => {
      this.throwIfDuplicateKey(error);
    });
  }

  findAll(companyId: string, user: AuthUserContext) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);
    return this.dcDistanceRepository.findAll(companyId);
  }

  async findById(id: string, user: AuthUserContext) {
    validateObjectId(id, 'dc-distance id');
    const dcDistance = await this.dcDistanceRepository.findById(id);

    if (!dcDistance) {
      throw new NotFoundException({
        message: `DC distance with id '${id}' not found`,
        error_code: errorCode.dcDistance.notFound,
      });
    }

    validateCompanyAccess(user, dcDistance.companyId);
    return dcDistance;
  }

  async getDistance(
    dto: GetDistanceDto,
    user: AuthUserContext,
    companyIdParam?: string,
  ) {
    const companyId = companyIdParam ?? dto.companyId;

    if (!companyId) {
      throw new BadRequestException({
        message: 'companyId is required',
        error_code: errorCode.apiCommon.badRequest,
      });
    }

    validateObjectId(companyId, 'company id');
    validateObjectId(dto.fromDelivery, 'from delivery id');
    validateObjectId(dto.toDelivery, 'to delivery id');
    validateCompanyAccess(user, companyId);

    const dcDistance = await this.dcDistanceRepository.findDistance(
      companyId,
      dto.fromDelivery,
      dto.toDelivery,
    );

    if (!dcDistance) {
      throw new NotFoundException({
        message: 'DC distance not found for the given deliveries',
        error_code: errorCode.dcDistance.notFound,
      });
    }

    return {
      id: dcDistance._id.toString(),
      calculatedDistance: dcDistance.calculatedDistance,
      companyDistance: dcDistance.companyDistance,
    };
  }

  async updateById(
    id: string,
    dto: UpdateDCDistanceDto,
    user: AuthUserContext,
  ) {
    validateObjectId(id, 'dc-distance id');

    const existingDCDistance = await this.dcDistanceRepository.findById(id);
    if (!existingDCDistance) {
      throw new NotFoundException({
        message: `DC distance with id '${id}' not found`,
        error_code: errorCode.dcDistance.notFound,
      });
    }

    validateCompanyAccess(user, existingDCDistance.companyId);

    try {
      const dcDistance = await this.dcDistanceRepository.updateById(id, dto);

      if (!dcDistance) {
        throw new NotFoundException({
          message: `DC distance with id '${id}' not found`,
          error_code: errorCode.dcDistance.notFound,
        });
      }

      return dcDistance;
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
        message: 'DC distance already exists between these deliveries for this company',
        error_code: errorCode.dcDistance.alreadyExists,
      });
    }

    throw error;
  }
}
