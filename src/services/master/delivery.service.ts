import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserContext, validateCompanyAccess } from '../../common/authorization/company-access.util';
import { CreateDeliveryDto } from '../../dto/master/delivery/create-delivery.dto';
import { UpdateDeliveryDto } from '../../dto/master/delivery/update-delivery.dto';
import { DeliveryRepository } from '../../repositories/master/delivery.repository';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';
import { getOsrmDistance } from '../../common/osrm-distance.util';

@Injectable()
export class DeliveryService {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async create(dto: CreateDeliveryDto, user: AuthUserContext) {
    validateObjectId(dto.companyId, 'company id');
    validateObjectId(dto.clientId, 'client id');
    validateCompanyAccess(user, dto.companyId);

    if (
      await this.deliveryRepository.existsByCompanyClientAndCode(
        dto.companyId,
        dto.clientId,
        dto.code,
      )
    ) {
      this.throwDuplicateCode();
    }

    return this.deliveryRepository.create(dto).catch((error: unknown) => {
      this.throwIfDuplicateKey(error);
    });
  }

  findAll(companyId: string, user: AuthUserContext, clientId?: string) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);
    if (clientId) {
      validateObjectId(clientId, 'client id');
    }
    return this.deliveryRepository.findAll(companyId, clientId);
  }

  async findById(id: string, user: AuthUserContext) {
    validateObjectId(id, 'delivery id');
    const delivery = await this.deliveryRepository.findById(id);

    if (!delivery) {
      throw new NotFoundException({
        message: `Delivery with id '${id}' not found`,
        error_code: errorCode.delivery.notFound,
      });
    }

    validateCompanyAccess(user, delivery.companyId);
    return delivery;
  }

  async calculateDistanceBetweenDeliveries(
    fromDeliveryId: string,
    toDeliveryId: string,
    user: AuthUserContext,
  ) {
    validateObjectId(fromDeliveryId, 'from delivery id');
    validateObjectId(toDeliveryId, 'to delivery id');

    const [fromDelivery, toDelivery] = await Promise.all([
      this.deliveryRepository.findById(fromDeliveryId),
      this.deliveryRepository.findById(toDeliveryId),
    ]);

    if (!fromDelivery) {
      throw new NotFoundException({
        message: `Delivery with id '${fromDeliveryId}' not found`,
        error_code: errorCode.delivery.notFound,
      });
    }

    if (!toDelivery) {
      throw new NotFoundException({
        message: `Delivery with id '${toDeliveryId}' not found`,
        error_code: errorCode.delivery.notFound,
      });
    }

    validateCompanyAccess(user, fromDelivery.companyId);
    validateCompanyAccess(user, toDelivery.companyId);

    const fromCoordinates = fromDelivery.address.coordinatesAddress;
    const toCoordinates = toDelivery.address.coordinatesAddress;
    if (!fromCoordinates || !toCoordinates) {
      throw new BadRequestException({
        message: 'Both deliveries must have coordinate addresses to calculate a route',
        error_code: errorCode.apiCommon.badRequest,
      });
    }

    const distance = await getOsrmDistance(
      fromCoordinates.latitude,
      fromCoordinates.longitude,
      toCoordinates.latitude,
      toCoordinates.longitude,
    );

    return {
      fromDeliveryId,
      toDeliveryId,
      ...distance,
    };
  }

  async updateById(id: string, dto: UpdateDeliveryDto, user: AuthUserContext) {
    validateObjectId(id, 'delivery id');

    const existingDelivery = await this.deliveryRepository.findById(id);

    if (!existingDelivery) {
      throw new NotFoundException({
        message: `Delivery with id '${id}' not found`,
        error_code: errorCode.delivery.notFound,
      });
    }

    validateCompanyAccess(user, existingDelivery.companyId);

    if (
      dto.code !== undefined &&
      (await this.deliveryRepository.existsByCompanyClientAndCode(
        existingDelivery.companyId.toString(),
        existingDelivery.clientId.toString(),
        dto.code,
        id,
      ))
    ) {
      this.throwDuplicateCode();
    }

    try {
      return await this.deliveryRepository.updateById(id, dto);
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
      this.throwDuplicateCode();
    }

    throw error;
  }

  private throwDuplicateCode(): never {
    throw new ConflictException({
      message: 'Delivery code already exists for this client in this company',
      error_code: errorCode.delivery.alreadyExists,
    });
  }
}
