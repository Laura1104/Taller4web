import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { AnimalsService }    from './animals.service';
import { CreateAnimalDto }   from './dto/create-animal.dto';
import { UpdateAnimalDto }   from './dto/update-animal.dto';
import { QueryAnimalsDto }   from './dto/query-animals.dto';

@ApiTags('animals')

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  
  @ApiOperation({ summary: 'Listar animales con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { data, total, page, limit }' })

  @Get()
  findAll(@Query() query: QueryAnimalsDto) {
    return this.animalsService.findAll(query);
  }

  
  @ApiOperation({ summary: 'Obtener un animal por UUID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal encontrado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.findOne(id);
  }

  
  @ApiOperation({ summary: 'Registrar un nuevo animal' })
  @ApiResponse({ status: 201, description: 'Animal creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (validación del DTO)' })

  @Post()
  create(@Body() dto: CreateAnimalDto) {
    return this.animalsService.create(dto);
  }

  
  @ApiOperation({ summary: 'Actualizar datos de un animal' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Animal actualizado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAnimalDto) {
    return this.animalsService.update(id, dto);
  }

  
  @ApiOperation({ summary: 'Eliminar un animal' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Animal eliminado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.remove(id);
  }
}