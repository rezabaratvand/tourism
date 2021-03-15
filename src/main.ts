import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from './exception/exception-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global exception filter
  // app.useGlobalFilters(new HttpExceptionFilter());

  // use global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true ? process.env.NODE_ENV == 'production' : false,
    }),
  );

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Tourism')
    // .setDescription('The Tourism Api')
    .setVersion('1.0')
    .addTag('tourism')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(3000);
}
bootstrap();
