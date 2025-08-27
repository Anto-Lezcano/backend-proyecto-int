import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  Length,
} from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "El correo es obligatorio." })
  @IsEmail({}, { message: "Debe ingresar un correo electrónico válido." })
  email: string;

  @IsNotEmpty({ message: "Debe ingresar el código que enviamos a su correo." })
  @Length(6, 6, { message: "El código debe tener 6 caracteres." })
  code: string;

  @IsNotEmpty({ message: "La contraseña es obligatoria." })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  @Matches(/[A-Z]/, {
    message: "La contraseña debe contener al menos una letra mayúscula.",
  })
  @Matches(/\d/, {
    message: "La contraseña debe contener al menos un número.",
  })
  newPassword: string;
}
