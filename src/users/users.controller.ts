import { Controller, Get, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";

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
}
