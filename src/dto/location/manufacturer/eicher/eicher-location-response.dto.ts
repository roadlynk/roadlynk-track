import { Type } from 'class-transformer';

export class EicherLocationDataDto {
  regNo?: string;
  chassisNo?: string;
  latitude?: number;
  longitude?: number;
  vehicleStatus?: string;
  lastUpdated?: number;
  epochTime?: number;
  vehicleSpeed?: number;
  odometer?: number;
  vehicleDirection?: number;
  deviceId?: string;
}

export class EicherLocationResponseDto {
  @Type(() => EicherLocationDataDto)
  locationData?: EicherLocationDataDto[];
  errorMessage?: string;
}