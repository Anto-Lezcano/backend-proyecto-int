import { Controller, Post, Body, Param, Delete } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { RegisterAuthDto } from "src/auth/dto/register-auth.dto";
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //CREAR PROFESOR O ADMIN
  @Post("create/staff")
  create(@Body() dto: RegisterAuthDto) {
    return this.adminService.createUsers(dto);
  }

  //ELIMINAR USUARIO

  @Delete("delete/:id")
  delete(@Param("id") id: number) {
    return this.adminService.deleteUser(id);
  }
}
