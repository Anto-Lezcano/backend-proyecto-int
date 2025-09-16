// documents.service.ts
import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import * as pdfParse from "pdf-parse";
import { MetadataDocumentDto } from "./dto/metadata-doc.dto";
import { use } from "passport";
@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private pythonVectorizationUrl: string;

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService
  ) {
    this.pythonVectorizationUrl =
      process.env.PYTHON_VECTORIZATION_URL || "http://127.0.0.1:8000";
  }

  async uploadAndProcess(
    file: Express.Multer.File,
    metadataDto: MetadataDocumentDto
  ) {
    try {
      //VALIDAR USUARIO
      const userExist = this.prisma.user.findUnique({
        where: { id: metadataDto.uploadById },
      });

      if (!userExist) {
        throw new BadRequestException(
          "El usuario que desea cargar el documento no existe en el sistema"
        );
      }

      //VALIDAR UNIDAD
      const unitExist = this.prisma.unit.findUnique({
        where: { id: metadataDto.unit },
      });

      if (!unitExist) {
        throw new BadRequestException("La unidad ingresada no existe");
      }

      this.logger.log(`Iniciando procesamiento del documento`);

      // 1. Subir PDF a Cloudinary
      this.logger.log("Subiendo PDF a Cloudinary...");
      const cloudinaryResult: any =
        await this.cloudinaryService.uploadPdf(file);

      // 2. Extraer texto del PDF
      this.logger.log("Extrayendo texto del PDF...");
      const content = await this.extractTextFromPdf(file.buffer);

      // 3. Guardar documento en la base de datos con URL de Cloudinary
      this.logger.log("Guardando documento en base de datos...");
      const document = await this.prisma.document.create({
        data: {
          filePath: cloudinaryResult.secure_url,
          cloudinaryPublicId: cloudinaryResult.public_id,
          unitId: Number(metadataDto.unit),
          uploadById: Number(metadataDto.uploadById),
        },
      });

      // 4. Vectorizamos doc
      console.log("Vectorizando documento...");
      const res = await fetch(`${this.pythonVectorizationUrl}/vectorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: document.id,
          content: content,
          metadata: {
            ...metadataDto,
            documentId: document.id,
          },
        }),
      });

      if (!res.ok) {
        throw new BadRequestException("Error vectorizando el documento");
      }

      const data = await res.json();
      console.log(data);
      this.logger.log(`Procesamiento completado con exito`);

      return {
        message: "Documento procesado con exito",
        document,
      };
    } catch (error) {
      this.logger.error("Error procesando documento:", error);
      throw new BadRequestException(
        `Error procesando el documento: ${error.message}`
      );
    }
  }

  // ----------extraccion de texto del pdf -----------------
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      this.logger.warn("No se pudo extraer texto del PDF:", error.message);
      return "";
    }
  }

  async getAllDocuments() {
    try {
      const documents = await this.prisma.document.findMany();

      if (!documents) {
        throw new NotFoundException("No se encontraron documentos");
      }
      return documents;
    } catch (error) {
      this.logger.error("Error obteniendo documentos:", error);
      throw new BadRequestException(
        `Error obteniendo documentos: ${error.message}`
      );
    }
  }

  async getAllByOrder(unitId: number) {
    try {
      const documents = await this.prisma.document.findMany({
        where: {
          unitId: unitId,
        },
      });
      if (documents.length <= 0) {
        throw new NotFoundException(
          `No existen documentos cargados en esta unidad`
        );
      }

      return documents;
    } catch (error) {}
  }
  async deleteDocument(id: number) {
    try {
      // Primero obtener el documento para tener el public_id de Cloudinary
      const document = await this.prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException("Documento no encontrado");
      }

      // Eliminar de Cloudinary
      if (document.cloudinaryPublicId) {
        await this.cloudinaryService.deletePdf(document.cloudinaryPublicId);
      }

      // Eliminar de la base de datos (las embeddings se eliminarán en cascada)
      await this.prisma.document.delete({
        where: { id },
      });

      console.log(`Documento ${id} eliminado exitosamente`);
      return { message: "Documento eliminado exitosamente" };
    } catch (error) {
      console.error(`Error eliminando documento ${id}:`, error);
      throw new BadRequestException(
        `Error eliminando documento: ${error.message}`
      );
    }
  }
}
