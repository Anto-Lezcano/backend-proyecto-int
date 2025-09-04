import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { NotFoundException } from "@nestjs/common";
import { RegisterAuthDto } from "src/auth/dto/register-auth.dto";
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  //OBTENER ADMINS
  async getAdmin() {
    const teachers = await this.prisma.user.findMany({
      where: { role: "admin" },
    });
    if (!teachers) {
      throw new NotFoundException("No se encontraron administradores");
    }
    return teachers;
  }

  //CREAR PROFESOR O ADMIN
  async createUsers(dto: RegisterAuthDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existUser) {
      {
        throw new Error("El correo ingresado ya existe");
      }
    }

    const allowedRoles = ["admin", "teacher"];

    if (!allowedRoles.includes(dto.role)) {
      throw new BadRequestException(
        `El rol '${dto.role}' no es válido. Roles permitidos: ${allowedRoles.join(", ")}`
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        dni: dto.dni,
        isEmailVerified: true,
      },
    });
  }

  //ELIMINAR USUARIO
  async deleteUser(id: number) {
    try {
      id = Number(id);

      const userExist = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!userExist) {
        throw new NotFoundException("El usuario no existe");
      }

      return await this.prisma.user.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Usuario no encontrado para eliminar");
      }
      throw error;
    }
  }
}
