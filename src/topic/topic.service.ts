import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  // CREAR TEMA
  async createTopic(createTopicDto: CreateTopicDto) {
    const unitExist = await this.prisma.unit.findUnique({
      where: { id: createTopicDto.unitId },
    });

    //VALIDAR UNIDAD
    if (!unitExist) {
      throw new NotFoundException(
        `La Unidad ${createTopicDto.unitId} no existe`
      );
    }
    const topicExist = await this.prisma.topic.findMany({
      where: { order: createTopicDto.order, unitId: createTopicDto.unitId },
    });

    //VALIDAR ORDEN DEL TEMA
    if (topicExist.length > 0) {
      throw new UnauthorizedException(
        `El orden ${createTopicDto.order} ya existe en la unidad ${createTopicDto.unitId}, es el tema ${topicExist[0].name}`
      );
    }
    return this.prisma.topic.create({ data: createTopicDto });
  }

  //OBTENER TEMAS POR UNIDAD
  async findAllTopic() {
    const topics = await this.prisma.topic.findMany();
    if (topics.length === 0) {
      throw new NotFoundException("Aun no se registraron temas");
    }
    return topics;
  }

  // OBTENER TEMAS POR UNIDAD
  async findTopicByUnit(unitId: number) {
    const existTopic = await this.prisma.topic.findMany({
      where: { unitId: unitId },
    });

    if (existTopic.length === 0) {
      throw new NotFoundException(
        `No se encontraron temas en la unidad ${unitId}`
      );
    }

    // RETORNO DE DATOS
    return existTopic;
  }

  // ACTUALIZAR TEMA
  async updateTopic(id: number, updateDto: UpdateTopicDto) {
    // VALIDACIONES
    const existTopic = await this.prisma.topic.findUnique({
      where: { id: id },
    });
    if (!existTopic) {
      throw new NotFoundException(`El tema ${id} no existe`);
    }

    // ACTUALIZAR DATOS

    const topicEdit = await this.prisma.topic.update({
      where: { id: id },
      data: updateDto,
    });

    // RETORNO DE DATOS
    return {
      message: `El tema ${existTopic.name} ha sido actualizado a ${topicEdit}`,
    };
  }

  // ELIMINAR TEMA
  async removeTopic(id: number) {
    const existTopic = await this.prisma.topic.findUnique({
      where: { id: id },
    });

    if (!existTopic) {
      throw new NotFoundException(`El tema ${id} no existe`);
    }
    const topicDelete = await this.prisma.topic.delete({ where: { id: id } });

    // RETORNO DE DATOS
    return {
      message: `El tema ${existTopic.name} ha sido eliminado`,
    };
  }
}
