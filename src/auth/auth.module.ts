import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "../common/jwt/jwt.service";
import { FirebaseAdminService } from "src/firebase/firebase.service";
import { EmailService } from "src/common/email/email.service";
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FirebaseAdminService, EmailService],
  imports: [PrismaModule],
})
export class AuthModule {}
