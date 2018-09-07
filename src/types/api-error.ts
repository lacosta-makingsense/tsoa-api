export type ErrorType = 'badRequest' |
  'unauthorized' |
  'forbidden' |
  'notFound' |
  'unprocessableEntity' |
  'internalServerError';

type ErrorTypes = {
  [K in ErrorType]: {
    statusCode: number;
    name: string;
    message: string;
  }
};

const errorTypes: ErrorTypes = {
  badRequest: { statusCode: 400, name: 'Bad Request', message: 'bad request' },
  unauthorized: { statusCode: 401, name: 'Unauthorized', message: 'unauthorized' },
  forbidden: { statusCode: 403, name: 'Forbidden', message: 'forbidden' },
  notFound: { statusCode: 404, name: 'Not Found', message: 'not found' },
  unprocessableEntity: { statusCode: 422, name: 'Unprocessable Entity', message: 'unprocessable entity' },
  internalServerError: { statusCode: 500, name: 'Internal Server Error', message: 'internal server error' },
};

export class ApiError extends Error {
  // public errorType: ErrorType;
  public statusCode: number;

  constructor(errorType: ErrorType, ...params) {
    super(...params);

    const { statusCode, name, message } = errorTypes[errorType];
    this.statusCode = statusCode;
    this.name = name;
    this.message = message;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class BadRequest extends ApiError {
  constructor(...params) {
    super('badRequest', ...params);
  }
}

export class Unauthorized extends ApiError {
  constructor(...params) {
    super('unauthorized', ...params);
  }
}

export class Forbidden extends ApiError {
  constructor(...params) {
    super('forbidden', ...params);
  }
}

export class NotFound extends ApiError {
  constructor(...params) {
    super('notFound', ...params);
  }
}

export class UnprocessableEntity extends ApiError {
  constructor(...params) {
    super('unprocessableEntity', ...params);
  }
}

export class InternalServerError extends ApiError {
  constructor(...params) {
    super('internalServerError', ...params);
  }
}
