import { expect } from 'chai';
import { stub } from 'sinon';

import { ValidateError } from 'tsoa';
import { UniqueConstraintError } from 'sequelize';

import errorHandler from '../../../middlewares/error-handler';
import { InternalServerError, BadRequest, UnprocessableEntity, NotFound } from '../../../types/api-error';

describe('ErrorHandler', () => {

  let jsonStub;
  let statusStub;
  let nextStub;

  beforeEach(() => {
    jsonStub = stub();
    statusStub = stub().returns({ json: jsonStub });
    nextStub = stub();
  });

  it('should handle api errors', () => {
    const error = new NotFound();
    errorHandler(
      error,
      null,
      { status: statusStub } as any,
      nextStub
    );

    expect(statusStub.calledWith(error.statusCode)).to.be.true; // tslint:disable-line
    // tslint:disable-next-line
    expect(jsonStub.calledWith({
      name: error.name,
      message: error.message
    })).to.be.true;
    expect(nextStub.calledOnce).to.be.true; // tslint:disable-line
  });

  it('should handle tsoa validation errors', () => {
    const error = new ValidateError({}, 'Error!');
    errorHandler(
      error,
      null,
      { status: statusStub } as any,
      nextStub
    );

    const apiError = new BadRequest();

    expect(statusStub.calledWith(apiError.statusCode)).to.be.true; // tslint:disable-line
    // tslint:disable-next-line
    expect(jsonStub.calledWith({
      name: apiError.name,
      message: apiError.message
    })).to.be.true; // tslint:disable-line;
    expect(nextStub.calledOnce).to.be.true; // tslint:disable-line
  });

  it('should handle sequelize unique key errors', () => {
    const error = new UniqueConstraintError({});
    errorHandler(
      error,
      null,
      { status: statusStub } as any,
      nextStub
    );

    const apiError = new UnprocessableEntity();

    expect(statusStub.calledWith(apiError.statusCode)).to.be.true; // tslint:disable-line
    // tslint:disable-next-line
    expect(jsonStub.calledWith({
      name: apiError.name,
      message: apiError.message
    })).to.be.true; // tslint:disable-line;
    expect(nextStub.calledOnce).to.be.true; // tslint:disable-line
  });

  it('should handle unexpected errors', () => {
    const error = new Error('Error!');
    errorHandler(
      error,
      null,
      { status: statusStub } as any,
      nextStub
    );

    const apiError = new InternalServerError();

    expect(statusStub.calledWith(apiError.statusCode)).to.be.true; // tslint:disable-line
    // tslint:disable-next-line
    expect(jsonStub.calledWith({
      name: apiError.name,
      message: apiError.message
    })).to.be.true; // tslint:disable-line;
    expect(nextStub.calledOnce).to.be.true; // tslint:disable-line
  });
});
