import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCareerDto } from "./dto/create-career.dto";
import { UpdateCareerDto } from "./dto/update-career.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {} from "@nestjs/common";
@Injectable()
export class CareerService {
  constructor(private prisma: PrismaService) {}

  // OBTENER CARRERAS
  async getCareers() {
    const careers = await this.prisma.career.findMany();
    if (careers.length === 0) {
      throw new NotFoundException("No se encontraron carreras.");
    }
    return careers;
  }

  // CREAR CARRERA
  async createCareer(dto: CreateCareerDto) {
    return await this.prisma.career.create({ data: dto });
  }

  // EDITAR CARRERA
  async updateCareer(id: number, dto: UpdateCareerDto) {
    const career = await this.prisma.career.findUnique({ where: { id: id } });
    if (!career) {
      throw new UnauthorizedException("La carrera que desea editar no existe");
    }
    return await this.prisma.career.update({ where: { id: id }, data: dto });
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
