import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EicherLocationPushDataDto {
  @IsString()
  @IsNotEmpty()
  regNo!: string;

  @IsOptional()
  @IsString()
  chassisNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  vehicleStatus?: string;

  @IsOptional()
  @Transform(({ value }) => (value == null ? value : String(value)))
  @IsString()
  lastUpdated?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  epochTime?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  vehicleSpeed?: number;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class EicherLocationPushDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EicherLocationPushDataDto)
  locationData?: EicherLocationPushDataDto[];

  @IsOptional()
  @IsString()
  errorMessage?: string;
}
