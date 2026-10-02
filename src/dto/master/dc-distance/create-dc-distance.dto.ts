import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDCDistanceDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  fromDelivery!: string;

  @IsString()
  @IsNotEmpty()
  toDelivery!: string;

  @IsNumber()
  @Min(0)
  calculatedDistance!: number;

  @IsNumber()
  @Min(0)
  companyDistance!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
