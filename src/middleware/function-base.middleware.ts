import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function newLogger(req: Request, res: Response, next: NextFunction) {
  console.log('logged in newLogger ...');
  next();
}
