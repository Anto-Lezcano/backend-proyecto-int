import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREAR UNIDAD
  async createUnit(createDto: CreateUnitDto) {
    const existCareer = this.prisma.career.findUnique({
      where: { id: createDto.careerId },
    });

    if (!existCareer) {
      throw new BadRequestException("La carrera que desea asociar no existe");
    }
    const newUnit = await this.prisma.unit.create({ data: createDto });

    return {
      message: `La unidad ${newUnit.order} fue creada con exito`,
    };
  }

  //OBTENER TODAS LAS UNIDADES
  async findAllUnits() {
    return await this.prisma.unit.findMany();
  }

  // OBTENER POR ORDEN
  async findOneforOrder(order: number) {
    const unit = await this.prisma.unit.findMany({ where: { order: order } });
    if (!unit) {
      throw new NotFoundException(`La unidad ${order} no existe`);
    }
    return unit;
  }

  // EDITAR UNIDAD
  async updateUnits(id: number, updateDto: UpdateUnitDto) {
    const existUnit = await this.prisma.unit.findUnique({ where: { id: id } });
    if (!existUnit) {
      throw new NotFoundException(`La unidad ${id} no existe`);
    }
    return await this.prisma.unit.update({
      where: { id: id },
      data: updateDto,
    });
  }
}
