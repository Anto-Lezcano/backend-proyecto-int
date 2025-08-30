import { OmitType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";
import { IsNotEmpty, IsEnum, IsString, MinLength } from "class-validator";
import { Role } from "../../../generated/prisma/client";

export class CompleteGoogleRegistrationDto extends OmitType(RegisterAuthDto, [
  "password",
  "firstName",
  "lastName",
] as const) {
  @IsNotEmpty({ message: "El rol es obligatorio." })
  @IsEnum(Role, {
    message: "El rol debe ser student, teacher o admin.",
  })
  role: Role;

  @IsNotEmpty({ message: "El DNI es obligatorio." })
  @IsString({ message: "El DNI debe ser una cadena de texto." })
  @MinLength(8, { message: "El DNI debe tener al menos 8 caracteres." })
  dni: string;
}
