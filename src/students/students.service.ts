import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
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

  //FILTRAR POR DNI

  async getStudentByDni(dni: string) {
    const student = await this.prisma.user.findMany({ where: { dni: dni } });

    if (!student) {
      return new NotFoundException(`El DNI ${dni} no se encuentra registrado`);
    }

    if (student[0].role !== "student") {
      return new BadRequestException(
        "El DNI ingresado no pertenece a un estudiante"
      );
    }

    return student;
  }

  // FILTRAR ESTUDIANTE POR ID
  async getStudentById(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!student) {
      throw new NotFoundException("El estudiante no existe");
    }
    if (student.role !== "student") {
      throw new BadRequestException(
        "El id ingresado no pertenece a un estudiante"
      );
    }
    return student;
  }

  //ELIMINAR ESTUDIANTE
  async deleteStudent(id: number) {
    const existUser = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!existUser) {
      throw new NotFoundException("El usuario que desea eliminar no existe");
    }

    if (existUser.role !== "student") {
      throw new BadRequestException("Solo esta permitido eliminar estudiantes");
    }
    const student = await this.prisma.user.delete({
      where: { id: id },
    });

    return {
      message: `El estudiante ${student.firstName} ${student.lastName} ha sido eliminado`,
    };
  }
}
