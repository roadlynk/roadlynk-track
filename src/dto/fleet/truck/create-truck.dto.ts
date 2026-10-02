import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Manufacturer } from '../../../schemas/fleet/truck.schema';

export class CreateTruckDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  truckNumber!: string;

  @IsString()
  @IsNotEmpty()
  chasisNumber!: string;

  @IsNumber()
  fuelTankCapacity!: number;

  @IsEnum(Manufacturer)
  manufacturer!: Manufacturer;

  @IsNumber()
  manufacturingYear!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}