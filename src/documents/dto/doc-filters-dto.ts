import { IsString, IsOptional } from "class-validator";

export class DocumentFiltersDto {
  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  uploadedBy?: string;
}
