import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CloudinaryService } from "./cloudinary.service";

@Module({
  imports: [ConfigModule], // ✅ Importar ConfigModule
  providers: [
    {
      provide: "CLOUDINARY",
      useFactory: (configService: ConfigService) => {
        return {
          cloud_name: configService.get("CLOUDINARY_CLOUD_NAME"),
          api_key: configService.get("CLOUDINARY_API_KEY"),
          api_secret: configService.get("CLOUDINARY_API_SECRET"),
        };
      },
      inject: [ConfigService], // ✅ Inyectar ConfigService
    },
    CloudinaryService,
  ],
  exports: ["CLOUDINARY", CloudinaryService],
})
export class CloudinaryModule {}
