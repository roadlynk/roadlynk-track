import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DeliveryType } from '../../../schemas/master/delivery.schema';
import { AddressDto } from '../common/address.dto';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deliveryName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsEnum(DeliveryType)
  deliveryType?: DeliveryType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
