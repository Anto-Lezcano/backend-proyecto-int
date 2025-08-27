import { OmitType } from "@nestjs/mapped-types";
import {
  IsString,
  IsEmail,
  MinLength,
  Length,
  Matches,
  IsNotEmpty,
} from "class-validator";

export class ForgotPasswordDto {
  @IsNotEmpty({ message: "El correo es obligatorio." })
  @IsEmail({}, { message: "Debe ingresar un correo electrónico válido." })
  email: string;

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

export class UpdatePasswordDto extends OmitType(ForgotPasswordDto, ["email"]) {}
