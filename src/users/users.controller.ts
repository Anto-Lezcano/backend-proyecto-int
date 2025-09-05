import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  Req,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password-dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //traer usuarios
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }

  //editar usuario
  @UseGuards(JwtAuthGuard)
  @Put("update/:id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  //Eliminar usuario
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.usersService.deleteUser(+id);
  }

  //EDITAR CONTRASEÑA
  @UseGuards(JwtAuthGuard)
  @Patch("update-password/:id")
  updatePassword(@Param("id") id: number, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(+id, dto);
  }
}
