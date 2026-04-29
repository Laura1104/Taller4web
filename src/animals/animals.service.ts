import {
  Injectable, NotFoundException,
  BadRequestException, InternalServerErrorException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { Animal }           from './entities/animal.entity';
import { Location }         from '../locations/entities/location.entity';
import { User }             from '../users/entities/user.entity';
import { CreateAnimalDto }  from './dto/create-animal.dto';
import { UpdateAnimalDto }  from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {

  private readonly logger = new Logger('AnimalsService');

  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAnimalDto) {
    const { locationId, registeredById, ...rest } = dto;

    let location: Location | null = null;
    if (locationId) {
      location = await this.locationRepo.findOne({ where: { id: locationId } });
      if (!location)
        throw new NotFoundException(`Location ${locationId} no encontrada`);
    }

    let registeredBy: User | null = null;
    if (registeredById) {
      registeredBy = await this.userRepo.findOne({ where: { id: registeredById } });
      if (!registeredBy)
        throw new NotFoundException(`User ${registeredById} no encontrado`);
    }

    try {
      const animal = this.animalRepo.create(rest);
      if (location)     animal.location     = location;
      if (registeredBy) animal.registeredBy = registeredBy;
      return await this.animalRepo.save(animal);
    } catch (err) { this.handleError(err); }
  }

  async findAll() {
    return this.animalRepo.find({
      relations: ['registeredBy'],
    });
  }

  async findOne(id: string) {
    const animal = await this.animalRepo.findOne({
      where: { id },
      relations: ['registeredBy', 'interestedUsers'],
    });
    if (!animal)
      throw new NotFoundException(`Animal ${id} no encontrado`);
    return animal;
  }

  async update(id: string, dto: UpdateAnimalDto) {
    const animal = await this.findOne(id);
    this.animalRepo.merge(animal, dto);
    try {
      return await this.animalRepo.save(animal);
    } catch (err) { this.handleError(err); }
  }

  async remove(id: string) {
    const animal = await this.findOne(id);
    await this.animalRepo.remove(animal);
    return { message: 'Animal eliminado exitosamente' };
  }

  private handleError(err: unknown): never {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      const pgErr = err as { code: string; detail?: string };
      throw new BadRequestException(`Valor duplicado: ${pgErr.detail}`);
    }
    this.logger.error(err);
    throw new InternalServerErrorException('Error inesperado — revisa los logs');
  }
}