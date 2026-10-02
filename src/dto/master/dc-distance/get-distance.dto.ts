import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetDistanceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  companyId?: string;

  @IsString()
  @IsNotEmpty()
  fromDelivery!: string;

  @IsString()
  @IsNotEmpty()
  toDelivery!: string;
}
