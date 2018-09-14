import { expect } from 'chai';
import { sign } from 'jsonwebtoken';

import { AuthenticationService } from '../../../services/authentication';
import { UserDocument } from '../../../models/user';
import { TokenPayload } from '../../../types/authentication';
import { AUTHORIZATION_SCOPES } from '../../../types/authorization';
import { ApiError } from '../../../types/api-error';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    service = new AuthenticationService();
  });

  it('should instantiate', () => {
    expect(service).to.exist; // tslint:disable-line
  });

  it('should create token', () => {
    const user = {
      _id: 'id',
      email: 'email',
      name: 'name',
      role: 'admin'
    } as UserDocument;

    const token = service.createToken(user);
    expect(token).to.exist; // tslint:disable-line

    const decodedToken = service.decodeToken(token);

    expect(user._id).to.equal(decodedToken._id);
    expect(user.name).to.equal(decodedToken.name);
    expect(user.email).to.equal(decodedToken.email);
    expect(decodedToken).not.to.have.property('role');
    expect(decodedToken.scopes).to.eql(AUTHORIZATION_SCOPES[user.role]);
  });

  it('should fail to decode an invalid token', () => {
    try {
      service.decodeToken('dummy');
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Unauthorized');
    }
  });

  it('should fail to decode an unauthorized token', () => {
    const user = {
      _id: 'id',
      email: 'email',
      name: 'name',
      role: 'admin'
    } as UserDocument;

    const token = sign(user, 'invalid secret');

    try {
      service.decodeToken(token);
      expect(false).to.be.true; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
      expect(e.name).to.equal('Unauthorized');
    }
  });

});
