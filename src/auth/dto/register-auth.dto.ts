import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsString,
  MaxLength,
  IsEnum,
} from "class-validator";
import { Role } from "../../../generated/prisma/client";
export class RegisterAuthDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  firstName: string;
  @IsNotEmpty({ message: "El apellido es obligatorio." })
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  lastName: string;
  @IsNotEmpty({ message: "El correo es obligatorio." })
  @IsEmail({}, { message: "Debe ingresar un correo electrónico válido." })
  email: string;

  @IsNotEmpty({ message: "El rol es obligatorio." })
  @IsString({ message: "El rol debe ser una cadena de texto." })
  @IsEnum(Role, {
    message: "El rol debe ser student, teacher o admin.",
  })
  role: Role;

  @IsNotEmpty({ message: "El dni es obligatorio." })
  @MinLength(8, { message: "El dni debe tener al menos 8 caracteres." })
  dni: string;

  @IsNotEmpty({ message: "La contraseña es obligatoria." })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  @Matches(/[A-Z]/, {
    message: "La contraseña debe contener al menos una letra mayúscula.",
  })
  @Matches(/\d/, {
    message: "La contraseña debe contener al menos un número.",
  })
  password: string;
}
