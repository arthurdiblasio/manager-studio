import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './configs/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, { logger });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3030);
}
bootstrap();
