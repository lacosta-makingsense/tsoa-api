import { createSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';

import jwtAuthentication from '../../../authentication/jwt';

describe('UserService', () => {
  const sandbox = createSandbox();
  let stub: SinonStub;

  beforeEach(function () {
    stub = sandbox.stub(jwtAuthentication, 'check');
  });

  afterEach(function () {
    sandbox.restore();
  });

});
