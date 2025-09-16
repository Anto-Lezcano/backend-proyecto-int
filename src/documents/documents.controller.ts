import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentsService } from "./documents.service";
import { MetadataDocumentDto } from "./dto/metadata-doc.dto";
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // CARGAR LOS DOCUMENTOS A LA BASE DE DATOS
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async UploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: MetadataDocumentDto
  ) {
    return this.documentsService.uploadAndProcess(file, metadata);
  }

  @Get()
  async getAllDocuments() {
    return this.documentsService.getAllDocuments();
  }

  @Delete("delete/:id")
  async deleteDocument(@Param("id") id: number) {
    return this.documentsService.deleteDocument(+id);
  }
}
