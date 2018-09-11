import { createSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';

import { UserService } from '../../../services/user';
import userModelMock from '../mocks/user.model';
import { ApiError } from '../../../types/api-error';

describe('UserService', () => {
  let service: UserService;
  const sandbox = createSandbox();
  let stub: SinonStub;

  beforeEach(function () {
    stub = sandbox.stub(userModelMock, 'findById');
  });

  afterEach(function () {
    sandbox.restore();
  });

  beforeEach(() => {
    service = new UserService(userModelMock as any);
  });

  it('should instantiate', async () => {
    expect(service).to.exist; // tslint:disable-line
  });

  it('should return a single user', async () => {
    const user = { email: 'test' };
    stub.returns(Promise.resolve(user));

    expect(await service.getById(1)).to.equal(user);
  });

  it('should throw an error if no user is found', async () => {
    stub.returns(Promise.resolve(null));

    try {
      await service.getById(1);
      expect(true).to.be.false; // tslint:disable-line
    } catch (e) {
      expect(e instanceof ApiError).to.be.true; // tslint:disable-line
    }
  });
});
