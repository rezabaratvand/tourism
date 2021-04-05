import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
// import { HttpExceptionFilter } from './exception/exception-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply csurf
  // app.use(csurf());

  // helmet middleware
  app.use(helmet());

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

  // apply compression middleware
  app.use(compression());

  const port = process.env.PORT || 3000;

  await app.listen(port);
  Logger.verbose(`application is running on: ${await app.getUrl()}`);
}
bootstrap();
