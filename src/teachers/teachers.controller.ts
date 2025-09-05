import { Controller, Get } from "@nestjs/common";
import { TeachersService } from "./teachers.service";

import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.teachersService.getTeachers();
  }
}
