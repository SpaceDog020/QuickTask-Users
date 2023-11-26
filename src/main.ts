import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de Passport
  app.use(passport.initialize());

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de la escucha
  await app.listen(3001);
}

bootstrap();
