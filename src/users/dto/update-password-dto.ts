import { ForgotPasswordDto } from "./forgot-password-dto";
import { OmitType } from "@nestjs/mapped-types";

export class UpdatePasswordDto extends OmitType(ForgotPasswordDto, ["email"]) {}
