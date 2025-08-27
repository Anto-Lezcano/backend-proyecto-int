import { OmitType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";

export class LoginAuthDto extends OmitType(RegisterAuthDto, [
  "dni",
  "firstname",
  "lastname",
  "role",
] as const) {}
