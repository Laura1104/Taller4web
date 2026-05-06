import { NestFactory }           from '@nestjs/core';
import { ValidationPipe }        from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule }              from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    transform:  true,
    whitelist:  true,
    forbidNonWhitelisted: true,
  }));

  // ── Swagger ────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('API de Adopción de Animales')
    .setDescription('Gestión de animales, usuarios y solicitudes de adopción')
    .setVersion('1.0')
    .addBearerAuth()        // habilita el botón "Authorize" para JWT
      .addServer('http://localhost:3000', 'Local')
  .addServer('https://api.miapp.com',  'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // La UI queda en http://localhost:3000/api/docs
  // El JSON queda en http://localhost:3000/api/docs-json


  await app.listen(3000);
}

void bootstrap();