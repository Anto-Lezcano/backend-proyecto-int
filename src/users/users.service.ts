import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password-dto";
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  //MOSTRAR USUARIOS
  async getUsers() {
    return await this.prisma.user.findMany();
  }

  //EDITAR USUARIO
  async updateUser(userId: number, dto: UpdateUserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existUser) {
      throw new Error("EL usuario que desea ingresar no existe");
    }
    return await this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  //ELIMINAR USUARIO
  async deleteUser(id: number) {
    const existUser = await this.prisma.user.findUnique({ where: { id: id } });

    if (!existUser) {
      throw new UnauthorizedException(
        "EL usuario que desea eliminar no existe"
      );
    }
    await this.prisma.user.delete({ where: { id: id } });

    return { message: "El usuario se ha eliminado con exito" };
  }

  //CAMBIAR CONTRASEÑA
  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existUser) {
      throw new UnauthorizedException("EL usuario que desea editar no existe");
    }
    return await this.prisma.user.update({ where: { id: userId }, data: dto });
  }
}
