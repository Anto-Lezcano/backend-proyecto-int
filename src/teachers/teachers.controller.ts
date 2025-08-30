import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TeachersService } from "./teachers.service";

import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.teachersService.getTeachers();
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  deleteStudent(@Param("id") id: number) {
    return this.teachersService.deleteStudent(id);
  }
}
