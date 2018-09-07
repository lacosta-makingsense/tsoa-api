import integrationHelper from '../IntegrationHelper';

before(async () => {
  await integrationHelper.setupDb();
  integrationHelper.createServer();
});
