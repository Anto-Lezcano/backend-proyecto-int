import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchDocumentsDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  filters?: {
    unit?: string;
    type?: string;
    difficulty?: string;
  };
}
