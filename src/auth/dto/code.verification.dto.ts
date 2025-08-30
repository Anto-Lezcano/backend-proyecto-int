import { OmitType } from "@nestjs/mapped-types";
import { IsNotEmpty, Length } from "class-validator";
import { ForgotPasswordDto } from "../../users/dto/forgot-password-dto";

export class codeVerificationDto extends OmitType(ForgotPasswordDto, [
  "password",
] as const) {
  @IsNotEmpty({ message: "Debe ingresar el codigo que enviamos a su correo." })
  @Length(6, 6, { message: "El código debe tener 6 caracteres." })
  code: string;
}
