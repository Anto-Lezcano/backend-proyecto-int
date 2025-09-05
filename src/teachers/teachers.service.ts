import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  //MOSTRAR PROFESORES
  async getTeachers() {
    const teachers = await this.prisma.user.findMany({
      where: { role: "teacher" },
    });
    if (!teachers) {
      throw new NotFoundException("No se encontraron profesores");
    }
    console.log(teachers);
    return teachers;
  }

  //ELIMINAR ESTUDIANTE
}
