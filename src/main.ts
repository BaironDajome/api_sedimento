import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors();// Habilitar CORS
  app.setGlobalPrefix('api/v1');// Prefijo global para rutas API

  app.useGlobalPipes( // Configuración de validación global
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en DTOs
      forbidNonWhitelisted: true, // Rechaza solicitudes con propiedades no permitidas
      transform: true, // Convierte tipos automáticamente según los DTOs
    })
  );

  console.log("2025");
   
  // Cargar configuración desde el servicio
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT', '3000'), 10);

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Sedimentación')
    .setDescription('Documentación de la API para monitoreo de sedimentación')
    .setVersion('1.0')
    .addBearerAuth() // Habilitar autenticación con JWT
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Iniciar el servidor
  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}/api/v1`);
  console.log(`Documentación en http://localhost:${port}/api/docs`);
}
bootstrap();
