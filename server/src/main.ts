import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configSystem } from '../config/system.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API for NestJS project')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  app.enableCors();

  await app.listen(configSystem.PORT);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
