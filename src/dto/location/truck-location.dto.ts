import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class TruckLocationDto {
  @IsString()
  @IsNotEmpty()
  truckNumber!: string;
}

export class TrucksLocationDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  truckNumbers?: string[];
}