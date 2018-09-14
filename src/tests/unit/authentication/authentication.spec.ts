import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { Request } from 'express';

import { expressAuthentication } from '../../../authentication/authentication';
import jwtAuthorization from '../../../authentication/jwt';
import { ApiError, Forbidden } from '../../../types/api-error';

describe('Authentication', () => {
  const sandbox = createSandbox();
  let stub: SinonStub;

  beforeEach(function () {
    stub = sandbox.stub(jwtAuthorization, 'check');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should call jwt authentication and succeed', async () => {
    stub.returns(Promise.resolve(true));

    await expressAuthentication({} as Request, 'jwt', []);
  });

  it('should call jwt authentication and fail', async () => {
    stub.returns(Promise.reject(new Forbidden()));

    try {
      await expressAuthentication({} as Request, 'jwt', []);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Forbidden');
    }
  });

  it('should fail with invalid auth mechanism', async () => {
    try {
      await expressAuthentication({} as Request, 'another', []);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Unauthorized');
    }
  });
});
