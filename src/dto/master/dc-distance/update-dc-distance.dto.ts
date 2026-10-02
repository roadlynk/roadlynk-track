import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateDCDistanceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  calculatedDistance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  companyDistance?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
