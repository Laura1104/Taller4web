import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsEmail, IsUUID, IsIn } from 'class-validator';

export class CreateAnimalDto {
  
  @ApiProperty({ example: 'Luna', description: 'Nombre del animal' })

  @IsString()
  nombre: string;

  
  @ApiProperty({ example: 'perro', description: 'Especie del animal' })

  @IsString()
  especie: string;

  
  @ApiProperty({ example: 18, description: 'Edad en meses' })

  @IsInt() @Min(0)
  edad: number;

  
  @ApiPropertyOptional({ example: 'Labrador dorada, muy activa y cariñosa' })

  @IsOptional() @IsString()
  descripcion?: string;

  
  @ApiProperty({ example: 'contacto@refugio.com' })

  @IsEmail()
  contacto: string;

  
  @ApiPropertyOptional({ example: 'disponible', enum: ['disponible', 'adoptado'], default: 'disponible' })

  @IsOptional() @IsIn(['disponible', 'adoptado'])
  estado?: string;

  
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'UUID de la ubicación' })

  @IsUUID()
  locationId: string;

  
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'UUID del usuario que registra' })

  @IsUUID()
  registeredById: string;
}