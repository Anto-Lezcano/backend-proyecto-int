import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) throw new UnauthorizedException("No autenticado");

    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        console.log("usu no encontrado");
        throw new UnauthorizedException("Usuario no encontrado");
      }

      if (user.sessionVersion > payload.sessionVersion) {
        console.log("sesion invalida");
        throw new UnauthorizedException(
          "Sesión inválida, por favor inicie sesión nuevamente"
        );
      }

      request["user"] = payload;

      return true;
    } catch (error) {
      console.error("Error al verificar token:", error.message);
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }
}
