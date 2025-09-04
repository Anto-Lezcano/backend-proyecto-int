import { Module } from "@nestjs/common";
import { FirebaseModule } from "./firebase/firebase.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { JwtGlobalModule } from "./common/jwt/jwt.module";
import { ModeloChatModule } from './modelo-chat/modelo-chat.module';
import { TeachersModule } from './teachers/teachers.module';
import { AdminModule } from './admin/admin.module';
import { UnitsModule } from './units/units.module';
import { CareerModule } from './career/career.module';
@Module({
  imports: [
    FirebaseModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    JwtGlobalModule,
    ModeloChatModule,
    TeachersModule,
    AdminModule,
    UnitsModule,
    CareerModule,
  ],
})
export class AppModule {}
