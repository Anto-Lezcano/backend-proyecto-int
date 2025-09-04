import { Injectable } from "@nestjs/common";
import { CreateCareerDto } from "./dto/create-career.dto";
import { UpdateCareerDto } from "./dto/update-career.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "@prisma/client";
import { UnauthorizedException } from "@nestjs/common";
@Injectable()
export class CareerService {
  constructor(private prisma: PrismaService) {}

  // OBTENER CARRERAS
  async getCareers() {
    const careers = await this.prisma.career.findMany();
    if (careers.length === 0) {
      throw new UnauthorizedException("No se encontraron carreras.");
    }
    return careers;
  }

  // CREAR CARRERA
  async createCareer(dto: CreateCareerDto) {
    return await this.prisma.career.create({ data: dto });
  }

  //ELIMINAR CARRERA
  async deleteCareer(id: number) {
    const career = await this.prisma.career.findUnique({ where: { id: id } });

    if (!career) {
      throw new UnauthorizedException(
        "La carrera que desea eliminar no existe"
      );
    }
    return await this.prisma.career.delete({ where: { id: id } });
  }
}
