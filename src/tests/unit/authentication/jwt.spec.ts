import { createSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';

import { JWTAuthentication } from '../../../authentication/jwt';
import authenticationService from '../mocks/authentication.service';
import { AuthenticationService } from '../../../services/authentication';
import { Unauthorized, Forbidden, ApiError } from '../../../types/api-error';

describe('JWTAuthentication', () => {
  const sandbox = createSandbox();
  let stub: SinonStub;
  let jwtAuthentication: JWTAuthentication;

  beforeEach(function () {
    stub = sandbox.stub(authenticationService, 'decodeToken');
    jwtAuthentication = new JWTAuthentication(authenticationService as any);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should instantiate', async () => {
    expect(jwtAuthentication).to.exist; // tslint:disable-line
  });

  it('should fail if header is missing', async () => {
    try {
      await jwtAuthentication.check({ headers: {} } as any);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Unauthorized');
    }
  });

  it('should fail if header is invalid', async () => {
    try {
      await jwtAuthentication.check({ headers: { authorization: 'Invalid' } } as any);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Unauthorized');
    }
  });

  it('should fail if token cannot be decoded', async () => {
    stub.throws(new Unauthorized());

    try {
      await jwtAuthentication.check({ headers: { authorization: 'Bearer dummy' } } as any);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Unauthorized');
    }
  });

  it('should fail if token does not contain the required scopes', async () => {
    stub.returns({ scopes: [ 'req1' ] });

    try {
      await jwtAuthentication.check({ headers: { authorization: 'Bearer dummy' } } as any, [ 'req1', 'req2' ]);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Forbidden');
    }
  });

  it('should succeed if token is valid', async () => {
    const decodedToken = {
      _id: 'userId',
      scopes: [ 'req1', 'req2' ]
    };
    stub.returns(decodedToken);

    const request: any = { headers: { authorization: 'Bearer dummy' } };

    await jwtAuthentication.check(request, [ 'req1', 'req2' ]);

    expect(request.user).to.equal(decodedToken);
  });
});
