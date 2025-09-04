import { IsString, IsNotEmpty } from "class-validator";

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  name: string;
  @IsString()
  @IsNotEmpty({ message: "La descripcion es obligatoria." })
  description: string;
}
