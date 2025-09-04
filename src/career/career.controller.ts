import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CareerService } from "./career.service";
import { CreateCareerDto } from "./dto/create-career.dto";
import { UpdateCareerDto } from "./dto/update-career.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { Role } from "@prisma/client";
import { use } from "passport";

@Controller("career")
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  //CREAR CARRERA
  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.createCareer(createCareerDto);
  }

  //OBTENER CARRERAS
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.careerService.getCareers();
  }

  //ELIMINAR CARRERA
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.careerService.deleteCareer(+id);
  }
}
