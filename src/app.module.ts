import { Module } from "@nestjs/common";
import { FirebaseModule } from "./firebase/firebase.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { JwtGlobalModule } from "./common/jwt/jwt.module";
@Module({
  imports: [
    FirebaseModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    JwtGlobalModule,
  ],
})
export class AppModule {}
