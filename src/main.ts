import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';

import * as express from 'express';

import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const uploadsDir = join(process.cwd(), 'FileUploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useStaticAssets(join(process.cwd(), 'FileUploads'), {
    prefix: '/uploads/',
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.enableCors();

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
