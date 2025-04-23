import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger, ZodValidationPipe } from '@anatine/zod-nestjs';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Documentação gerada automaticamente pela API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  patchNestjsSwagger(); // <--- This is the hacky patch using prototypes (for now)
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('🚀 Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
bootstrap();
