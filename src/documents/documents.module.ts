import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [PrismaModule, CloudinaryModule],
})
export class DocumentsModule {}
