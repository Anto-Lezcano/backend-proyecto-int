import { IsNotEmpty, IsNumber } from "class-validator";
export class MetadataDocumentDto {
  @IsNumber()
  @IsNotEmpty({ message: "El rol es obligatorio." })
  unit: number;

  @IsNumber()
  @IsNotEmpty()
  uploadById: number;
}
