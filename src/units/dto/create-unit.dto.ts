import { IsString, IsNumber } from "class-validator";

export class CreateUnitDto {
  @IsString()
  name: string;
  @IsNumber()
  order: number;
}
