import { expect } from 'chai';
import { Types } from 'mongoose';

import integrationHelper from '../integration-helper';
import integrationOperations from '../integration-operations';
import { UserRequest, UserCreateRequest } from '../../types/user';
import { UserRole } from '../../types/authorization';

const route: string = `${integrationHelper.rootPath}/users`;
const entityName: string = 'Users';

describe(`${entityName} - ${route}`, () => {

  beforeEach(() => integrationOperations.deleteAllUsers());

  describe('POST', () => {
    it('should create', async () => {
      const userRequest: UserCreateRequest = {
        email: 'test@email.com',
        name: 'Test Name',
        role: UserRole.Admin,
        password: 'test'
      };

      const res = await integrationHelper.app.post(route).send(userRequest);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name');
      expect(res.body.name).to.equal('Test Name');
      expect(res.body).to.have.property('email');
      expect(res.body.email).to.equal('test@email.com');
      expect(res.body).to.have.property('role');
      expect(res.body.role).to.equal('admin');
      expect(res.body).not.to.have.property('password');
      expect(res.body).not.to.have.property('_password');
      expect(res.body).not.to.have.property('hashedPassword');
    });

    it('should fail to create if there are missing params', async () => {
      const res = await integrationHelper.app.post(route).send({});
      expect(res.status).to.equal(400);
    });

    it('should fail to create if there are invalid params', async () => {
      const userRequest: UserCreateRequest = {
        email: 'invalid',
        name: 'Test Name',
        role: UserRole.Admin,
        password: 'test'
      };

      const res = await integrationHelper.app.post(route).send(userRequest);
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /{id}', () => {
    it('should update', async () => {
      const user = await integrationOperations.createUser(1);

      const userRequest: UserRequest = {
        email: 'test@email.com',
        name: 'Test Name',
        role: UserRole.Admin,
        password: 'test'
      };

      const res = await integrationHelper.app.put(`${route}/${user.id}`).send(userRequest);
      expect(res.status).to.equal(200);
      expect(res.body._id).to.deep.equal(user.id);
      expect(res.body.email).to.deep.equal('test@email.com');
      expect(res.body.name).to.deep.equal('Test Name');
      expect(res.body.role).to.deep.equal('admin');
      expect(res.body).not.to.have.property('password');
      expect(res.body).not.to.have.property('_password');
      expect(res.body).not.to.have.property('hashedPassword');
    });

    it('should fail to update if the doc does not exists', async () => {
      const userRequest: UserRequest = {
        email: 'test@email.com',
        name: 'Test Name',
        role: UserRole.Admin
      };
      const id = Types.ObjectId();

      const res = await integrationHelper.app.put(`${route}/${id}`).send(userRequest);
      expect(res.status).to.equal(404);
    });

    it('should fail to update if the id is invalid', async () => {
      const userRequest: UserRequest = {
        email: 'test@email.com',
        name: 'Test Name',
        role: UserRole.Admin
      };

      const res = await integrationHelper.app.put(`${route}/dummy`).send(userRequest);
      expect(res.status).to.equal(400);
    });

    it('should fail to update if there are missing params', async () => {
      const user = await integrationOperations.createUser(1);

      const res = await integrationHelper.app.put(`${route}/${user.id}`).send({});
      expect(res.status).to.equal(400);
    });
  });

  describe('GET', () => {
    it('should search', async () => {
      await integrationOperations.createUser(1);
      const user2 = await integrationOperations.createUser(2);

      const res = await integrationHelper.app.get(
        `${route}?page=1&limit=1&sortBy=email&sortDirection=DESC&query=user`
      );
      expect(res.status).to.equal(200);
      expect(res.body.count).to.equal(2);
      expect(res.body.items.length).to.equal(1);
      expect(res.body.items[0]._id).to.equal(user2.id);
      expect(res.body.items[0].email).to.equal(user2.email);
      expect(res.body.items[0].name).to.equal(user2.name);
      expect(res.body.items[0].role).to.equal(user2.role);
    });

    it('should fail to search with invalid params', async () => {
      const res = await integrationHelper.app.get(`${route}?page=0`);
      expect(res.status).to.equal(400);
    });
  });

  describe('GET /{id}', () => {
    it('should get one', async () => {
      const user = await integrationOperations.createUser(1);

      const res = await integrationHelper.app.get(`${route}/${user.id}`);
      expect(res.status).to.equal(200);
      expect(res.body._id).to.deep.equal(user.id);
      expect(res.body.email).to.deep.equal(user.email);
      expect(res.body.name).to.deep.equal(user.name);
    });

    it('should fail to get one if id does not exists', async () => {
      const id = Types.ObjectId();
      const res = await integrationHelper.app.get(`${route}/${id}`);
      expect(res.status).to.equal(404);
    });

    it('should fail to get one if invalid', async () => {
      const res = await integrationHelper.app.get(`${route}/dummy`);
      expect(res.status).to.equal(400);
    });
  });

  describe('DELETE /{id}', () => {
    it('should delete one', async () => {
      const user = await integrationOperations.createUser(1);

      const res = await integrationHelper.app.delete(`${route}/${user.id}`);
      expect(res.status).to.equal(204);
    });

    it('should FAIL to delete if id does not exists', async () => {
      const id = Types.ObjectId();
      const res = await integrationHelper.app.delete(`${route}/${id}`);
      expect(res.status).to.equal(404);
    });

    it('should FAIL to delete if id is invalid', async () => {
      const res = await integrationHelper.app.delete(`${route}/dummy`);
      expect(res.status).to.equal(400);
    });
  });
});
