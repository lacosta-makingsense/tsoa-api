import { ValidateError } from 'tsoa';
import { Request, Response, NextFunction } from 'express';

import { Logger } from '../util/logger';
import { ApiError, InternalServerError, BadRequest } from '../types/api-error';

export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof ValidateError) {
    apiError = new BadRequest();
  } else {
    apiError = new InternalServerError();
  }

  Logger.error(
    `Error: ${apiError.statusCode}`,
    `Error Name: ${apiError.name}`,
    `Error Message: ${apiError.message}`,
    'Original Error: ', error.message
  );
  res.status(apiError.statusCode).json({ name: apiError.name, message: apiError.message });
  next();
}
