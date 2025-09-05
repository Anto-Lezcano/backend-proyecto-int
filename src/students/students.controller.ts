import { Controller, Get, Param, Delete, Body } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("students")
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  //OBTENER ESTUDIANTES
  @UseGuards(JwtAuthGuard)
  @Get()
  async getStudents() {
    return this.students.gelAllStudents();
  }

  //FILTRAR ESTUDIANTE POR ID

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getStudentById(@Param("id") id: number) {
    return this.students.getStudentById(+id);
  }

  //FILTRAR ESTUDIANTE POR DNI
  @UseGuards(JwtAuthGuard)
  @Get("dni")
  async getStudentByDni(@Body("dni") dni: string) {
    return this.students.getStudentByDni(dni);
  }

  //ELIMINAR ESTUDIANTE
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  async deleteStudent(@Param("id") id: number) {
    return this.students.deleteStudent(+id);
  }
}
