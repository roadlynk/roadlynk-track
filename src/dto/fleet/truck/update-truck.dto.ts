import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Manufacturer } from '../../../schemas/fleet/truck.schema';

export class UpdateTruckDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  truckNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  chasisNumber?: string;

  @IsOptional()
  @IsNumber()
  fuelTankCapacity?: number;

  @IsOptional()
  @IsEnum(Manufacturer)
  manufacturer?: Manufacturer;

  @IsOptional()
  @IsNumber()
  manufacturingYear?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}