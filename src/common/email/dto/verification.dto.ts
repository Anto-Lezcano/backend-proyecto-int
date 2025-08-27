import { IsString, IsNotEmpty } from "class-validator";

export class verificationDto {
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsString()
  @IsNotEmpty()
  email: string;
}
