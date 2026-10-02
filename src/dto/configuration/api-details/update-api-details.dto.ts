import {
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Manufacturer } from '../../../schemas/fleet/truck.schema';

export class UpdateApiDetailsDto {
  @IsOptional()
  @IsEnum(Manufacturer)
  manufacturer?: Manufacturer;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  apiCredentials?: Record<string, string>;
}