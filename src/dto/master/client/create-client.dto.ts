import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  clientCode!: string;

  @IsOptional()
  @IsBoolean()
  isOwnCompany?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
