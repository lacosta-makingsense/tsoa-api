import { expect } from 'chai';

import { UserService } from '../../../services/user';
import userModelMock from '../mocks/UserModelMock';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(userModelMock as any);
  });

  it('should instantiate', async () => {
    expect(service).to.exist; // tslint:disable-line
  });
});
