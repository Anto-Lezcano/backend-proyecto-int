import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  unitId: number;
}
