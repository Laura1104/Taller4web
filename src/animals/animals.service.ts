import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryAnimalsDto } from './dto/query-animals.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Animal } from './entities/animal.entity';

@Injectable()
export class AnimalsService {

  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
     private readonly cloudinaryService: CloudinaryService,
  ) {}
  async findAll(query: QueryAnimalsDto): Promise<{
    data: Animal[];
    total: number;
    page: number;
    limit: number;
  }> {

    const page  = query.page  ?? 1;
    const limit = query.limit ?? 10;

    const [data, total]: [Animal[], number] =
      await this.animalRepo.findAndCount({
        where: {
          ...(query.especie && { especie: query.especie }),
          ...(query.estado  && { estado:  query.estado }),
        },
        relations: ['registeredBy'],
        skip: (page - 1) * limit,
        take: limit,
      });

    return { data, total, page, limit };
  }

  
  async create(dto: CreateAnimalDto): Promise<Animal> {
    const animal = this.animalRepo.create(dto);
    return await this.animalRepo.save(animal);
  }


  async findOne(id: string): Promise<Animal> {
    const animal = await this.animalRepo.findOne({ where: { id } });

    if (!animal) {
      throw new NotFoundException(`Animal ${id} no encontrado`);
    }

    return animal;
  }


  async update(id: string, dto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);

    Object.assign(animal, dto);

    return await this.animalRepo.save(animal);
  }


  async remove(id: string): Promise<void> {
    const animal = await this.findOne(id);
    await this.animalRepo.remove(animal);
  }

  
  async uploadImagen(id: string, file: Express.Multer.File): Promise<Animal> {
    // 1. Verificar que el animal existe (lanza 404 si no)
    await this.findOne(id);

    // 2. Subir el buffer a Cloudinary y recibir la URL
    const url = await this.cloudinaryService.uploadBuffer(
      file.buffer,
      'animales-adopcion',  // carpeta en tu cuenta Cloudinary
    );

    // 3. Guardar la URL en la columna "imagen"
    await this.animalRepo.update(id, { imagen: url });

    // 4. Retornar el animal actualizado
    return this.findOne(id);
  }
}