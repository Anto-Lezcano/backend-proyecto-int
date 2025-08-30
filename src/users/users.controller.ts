import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password-dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //traer usuarios
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }

  //editar usuario
  @Patch("update/:id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  //Eliminar usuario
  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.usersService.deleteUser(+id);
  }

  //EDITAR CONTRASEÑA
  @Patch("update-password/:id")
  updatePassword(@Param("id") id: number, @Body() updatePasswordDto: any) {
    return this.usersService.updatePassword(+id, updatePasswordDto);
  }
}
