import { IsString, IsNumber } from "class-validator";
export class ChatDto {
  @IsString()
  question: string;
  @IsNumber()
  student_id: number;
  @IsString()
  unit: string;
}
