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

  // MOSTRAR ESTUDIANTES

  async gelAllStudents() {
    const students = await this.prisma.user.findMany({
      where: { role: "student" },
    });
    if (!students) {
      throw new NotFoundException("No se encontraron estudiantes registrados");
    }
    return students;
  }

  // FILTRAR ESTUDIANTE POR ID

  async getStudent(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!student) {
      throw new NotFoundException("El estudiante no existe");
    }
    return student;
  }

  //ELIMINAR ESTUDIANTE
  async deleteStudent(id: number) {
    const existUser = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!existUser) {
      throw new NotFoundException("El usuario no existe");
    }
    if (existUser.role !== "student") {
      throw new NotFoundException("Solo se pueden eliminar estudiantes");
    }
    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
