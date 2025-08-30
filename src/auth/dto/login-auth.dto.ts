import { OmitType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";

export class LoginAuthDto extends OmitType(RegisterAuthDto, [
  "dni",
  "firstName",
  "lastName",
  "role",
] as const) {}
