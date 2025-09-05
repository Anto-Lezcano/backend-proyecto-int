import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}
