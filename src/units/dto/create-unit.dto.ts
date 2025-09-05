import {
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from "class-validator";

export class CreateUnitDto {
  @IsString()
  name: string;
  @IsNumber()
  order: number;
  @IsString()
  @IsOptional()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  careerId: number;
}
