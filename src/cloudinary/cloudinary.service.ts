import { Injectable, Inject } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  constructor(@Inject("CLOUDINARY") private readonly cloudinaryConfig: any) {
    // Configurar Cloudinary con los valores inyectados
    cloudinary.config(this.cloudinaryConfig);
  }

  async uploadPdf(file: Express.Multer.File, folder: string = "documents") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Para PDFs usar 'raw'
          folder: folder,
          format: "pdf",
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  async getFileUrl(publicId: string, resourceType: string = "raw") {
    return cloudinary.url(publicId, {
      resource_type: resourceType,
    });
  }

  async deletePdf(publicId: string, resourceType: string = "raw") {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}
