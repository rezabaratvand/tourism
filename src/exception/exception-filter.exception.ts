import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

// @Catch(HttpException)
@Catch() // to catch all exceptions should be empty.
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown /*HttpException*/, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // to get message from response
    const exc: any = exception;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date().toISOString(),
      messages:
        exception instanceof HttpException ? exc.response.message : 'something failed',
    });
  }
}

// simple exception filter base on the baseExceptionFilter class
// @Catch()
// export class AllExceptionFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     super.catch(exception, host);
//   }
// }
