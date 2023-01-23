import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true, // Para mandar mas informacion de la que se requiere, pero graphql ya hace esto por nosotros...
    })
   );
  await app.listen(3000);
}
bootstrap();
