import {
  Controller, Get, Post, Body,
  Patch, Param, Delete, ParseUUIDPipe
} from '@nestjs/common';

import {
  ApiTags, ApiOperation, ApiResponse, ApiParam
} from '@nestjs/swagger';

import { AdoptionRequestsService } from './adoption-requests.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@ApiTags('adoption-requests')
@Controller('adoption-requests')
export class AdoptionRequestsController {

  constructor(
    private readonly adoptionRequestsService: AdoptionRequestsService
  ) {}

  @ApiOperation({ summary: 'Crear solicitud de adopción' })
  @ApiResponse({ status: 201, description: 'Solicitud creada' })
  @ApiResponse({ status: 409, description: 'Solicitud duplicada o animal ya adoptado' })
  @Post()
  create(@Body() dto: CreateAdoptionRequestDto) {
    return this.adoptionRequestsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar todas las solicitudes' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes' })
  @Get()
  findAll() {
    return this.adoptionRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionRequestsService.findOne(id);
  }

  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @Patch(':id/status') 
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdoptionRequestDto,
  ) {
    return this.adoptionRequestsService.updateStatus(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar solicitud' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Solicitud eliminada' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionRequestsService.remove(id);
  }
}