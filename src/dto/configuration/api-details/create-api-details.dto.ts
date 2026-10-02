import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';
import { Manufacturer } from '../../../schemas/fleet/truck.schema';

export class CreateApiDetailsDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsEnum(Manufacturer)
  manufacturer!: Manufacturer;

  @IsObject()
  @IsNotEmptyObject()
  apiCredentials!: Record<string, string>;
}