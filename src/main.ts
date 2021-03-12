import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/exception-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global exception filter
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
