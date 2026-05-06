import { ApiProperty } from '@nestjs/swagger';
import { IsIn }         from 'class-validator';

export class UpdateAdoptionRequestDto {
  
  @ApiProperty({
    example: 'aprobada',
    enum: ['aprobada', 'rechazada'],
    description: 'Nuevo estado de la solicitud',
  })

  @IsIn(['aprobada', 'rechazada'])
  status: string;
}