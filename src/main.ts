// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as bodyParser from 'body-parser';
// import { ValidationPipe } from '@nestjs/common';
// import { join } from 'path';
// import * as path from 'path';
// import { existsSync, mkdirSync } from 'fs';

// import * as express from 'express';

// import { NestExpressApplication } from '@nestjs/platform-express';
// import { ConfigService } from '@nestjs/config';
// async function bootstrap() {
//   const uploadsDir = join(process.cwd(), 'FileUploads');
//   if (!existsSync(uploadsDir)) {
//     mkdirSync(uploadsDir);
//   }
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     cors: true,
//   });
//   const configService = app.get(ConfigService);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     }),
//   );
//   app.useStaticAssets(join(process.cwd(), 'FileUploads'), {
//     prefix: '/uploads/',
//   });
//   app.use(bodyParser.json({ limit: '50mb' }));
//   app.enableCors();

//   await app.listen(process.env.PORT ?? 4000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';

let cachedServer: any;

async function bootstrap() {
  if (cachedServer) {
    return cachedServer;
  }

  const uploadsDir = join(process.cwd(), 'FileUploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'FileUploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: '*', // or frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.init(); // ❌ don’t call app.listen()

  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

// Vercel expects this export
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
}
