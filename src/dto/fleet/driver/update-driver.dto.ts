import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDriverDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  licenceNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
