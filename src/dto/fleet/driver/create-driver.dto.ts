import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber!: string;

  @IsString()
  @IsNotEmpty()
  licenceNumber!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
