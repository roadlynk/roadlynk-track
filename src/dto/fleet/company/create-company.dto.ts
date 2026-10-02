import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyCode!: string;

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail!: string;

  @IsString()
  @IsNotEmpty()
  contactNumber!: string;

  @IsOptional()
  @IsNumber()
  lastDcSequence?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isCompanyAdmin?: boolean;
}
