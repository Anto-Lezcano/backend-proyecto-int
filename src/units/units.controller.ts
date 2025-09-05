import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { UnitsService } from "./units.service";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";

@Controller("units")
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  //CREAR UNIDAD
  @Post("create")
  create(@Body() createDto: CreateUnitDto) {
    return this.unitsService.createUnit(createDto);
  }

  //BUSCAR TODAS LAS UNIDADES
  @Get()
  findAll() {
    return this.unitsService.findAllUnits();
  }

  //BUSCAR UNIDAD POR ORDEN

  @Get(":order")
  findOne(@Param("order") order: number) {
    return this.unitsService.findOneforOrder(+order);
  }

  @Put("update/:id")
  update(@Param("id") id: number, @Body() updateUnitDto: UpdateUnitDto) {
    console.log(id);
    return this.unitsService.updateUnits(+id, updateUnitDto);
  }
}
