import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.service";

@Global()
@Module({
  providers: [JwtStrategy],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "es_un_secreto",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  exports: [JwtModule, JwtStrategy],
})
export class JwtGlobalModule {}
