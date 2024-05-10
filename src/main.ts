import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Checkuiz API')
    .setDescription('Checkuiz API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'access-token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: [process.env.CLIENT_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(8000);
}
bootstrap();
