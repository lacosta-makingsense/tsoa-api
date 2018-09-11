import integrationHelper from '../integration-helper';

before(async () => {
  await integrationHelper.setupDb();
  integrationHelper.createServer();
});
