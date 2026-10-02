import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressType } from '../../../schemas/master/common/address.scheama';

export class AddressPincodeDto {
  @IsString()
  @IsNotEmpty()
  pincode!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  town!: string;

  @IsString()
  @IsNotEmpty()
  fullAddress!: string;
}

export class AddressCoordinatesDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsString()
  @IsNotEmpty()
  fullAddress!: string;
}

export class AddressDto {
  @IsEnum(AddressType)
  type!: AddressType;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressPincodeDto)
  pincodeAddress?: AddressPincodeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressCoordinatesDto)
  coordinatesAddress?: AddressCoordinatesDto;
}
