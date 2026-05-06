import { Module }         from '@nestjs/common';
import { TypeOrmModule }  from '@nestjs/typeorm';
import { MulterModule }  from '@nestjs/platform-express';
import { memoryStorage }  from 'multer';

import { Animal }        from './entities/animal.entity';
import { AnimalsController } from './animals.controller';
import { AnimalsService }    from './animals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal]),
    MulterModule.register({ storage: memoryStorage() }),

  ],
  controllers: [AnimalsController],
  providers:   [AnimalsService],
})
export class AnimalsModule {}