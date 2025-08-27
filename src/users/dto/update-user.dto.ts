import { IsOptional, Matches, MaxLength, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  @MaxLength(30, { message: "El nombre no debe superar los 30 caracteres." })
  @Matches(/^[^\s]+$/, {
    message: "El nombre no puede contener espacios.",
  })
  firstName: string;

  @IsOptional()
  @IsString({ message: "El apellido debe ser una cadena de texto." })
  @MaxLength(30, { message: "El apellido no debe superar los 30 caracteres." })
  @Matches(/^[^\s]+$/, {
    message: "El apellido no puede contener espacios.",
  })
  lastName: string;
}
