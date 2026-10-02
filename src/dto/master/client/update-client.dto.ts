import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  clientCode?: string;

  @IsOptional()
  @IsBoolean()
  isOwnCompany?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
