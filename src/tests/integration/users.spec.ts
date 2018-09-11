import { expect } from 'chai';

import integrationHelper from '../integration-helper';
import integrationOperations from '../integration-operations';
import { UserRequestData } from '../../types/user';

const route: string = `${integrationHelper.rootPath}/users`;
const entityName: string = 'Users';

describe(`${entityName} - ${route}`, () => {

  beforeEach(() => integrationOperations.deleteAllUsers());

  describe('POST', () => {
    it(`should create`, async () => {
      const userRequest: UserRequestData = {
        email: 'test@email.com',
        name: 'Test Name'
      };

      const res = await integrationHelper.app.post(route).send(userRequest);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('name');
      expect(res.body.name).to.equal('Test Name');
      expect(res.body).to.have.property('email');
      expect(res.body.email).to.equal('test@email.com');
    });

    it(`should fail to create if missing params`, async () => {
      const res = await integrationHelper.app.post(route).send({});
      expect(res.status).to.equal(400);
    });

    it(`should fail to create if invalid params`, async () => {
      const userRequest: UserRequestData = {
        email: 'invalid',
        name: 'Test Name'
      };

      const res = await integrationHelper.app.post(route).send(userRequest);
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /{id}', () => {
    it(`should update`, async () => {
      const user = await integrationOperations.createUser(1);

      const userRequest: UserRequestData = {
        email: 'test@email.com',
        name: 'Test Name'
      };

      const res = await integrationHelper.app.put(`${route}/${user.id}`).send(userRequest);
      expect(res.status).to.equal(200);
      expect(res.body.id).to.deep.equal(user.id);
      expect(res.body.email).to.deep.equal('test@email.com');
      expect(res.body.name).to.deep.equal('Test Name');
    });

    it(`should fail to update if missing`, async () => {
      const userRequest: UserRequestData = {
        email: 'test@email.com',
        name: 'Test Name'
      };

      const res = await integrationHelper.app.put(`${route}/111111111`).send(userRequest);
      expect(res.status).to.equal(404);
    });

    it(`should fail to update if missing`, async () => {
      const user = await integrationOperations.createUser(1);

      const res = await integrationHelper.app.put(`${route}/${user.id}`).send({});
      expect(res.status).to.equal(400);
    });
  });

  describe('GET', () => {
    it(`should search`, async () => {
      await integrationOperations.createUser(1);
      const user2 = await integrationOperations.createUser(2);

      const res = await integrationHelper.app.get(
        `${route}?page=1&limit=1&sortBy=email&sortDirection=DESC&query=user`
      );
      expect(res.status).to.equal(200);
      expect(res.body.count).to.equal(2);
      expect(res.body.items.length).to.equal(1);
      expect(res.body.items[0].id).to.equal(user2.id);
      expect(res.body.items[0].email).to.equal(user2.email);
      expect(res.body.items[0].name).to.equal(user2.name);
    });

    it(`should fail to search on invalid params`, async () => {
      const res = await integrationHelper.app.get(`${route}?page=0`);
      expect(res.status).to.equal(400);
    });
  });

  describe('GET /{id}', () => {
    it(`should get one`, async () => {
      const user = await integrationOperations.createUser(1);

      const res = await integrationHelper.app.get(`${route}/${user.id}`);
      expect(res.status).to.equal(200);
      expect(res.body.id).to.deep.equal(user.id);
      expect(res.body.email).to.deep.equal(user.email);
      expect(res.body.name).to.deep.equal(user.name);
    });

    it(`should fail to get one if missing`, async () => {
      const res = await integrationHelper.app.get(`${route}/11111111`);
      expect(res.status).to.equal(404);
    });

    it(`should fail to get one if invalid`, async () => {
      const res = await integrationHelper.app.get(`${route}/dummy`);
      expect(res.status).to.equal(400);
    });
  });

  describe('DELETE /{id}', () => {
    it(`should delete one`, async () => {
      const user = await integrationOperations.createUser(1);

      const res = await integrationHelper.app.delete(`${route}/${user.id}`);
      expect(res.status).to.equal(204);
    });

    it(`should FAIL to delete one: ${entityName}`, async () => {
      const res = await integrationHelper.app.delete(`${route}/11111111`);
      expect(res.status).to.equal(404);
    });
  });
});
