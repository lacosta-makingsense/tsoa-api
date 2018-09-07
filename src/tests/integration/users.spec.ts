import { expect } from 'chai';

import integrationHelper from '../IntegrationHelper';
import { UserRequestData } from '../../types/user';

const route: string = `${integrationHelper.rootPath}/users`;
const entityName: string = 'user';

describe(`${route}`, () => {

  const userRequest: UserRequestData = {
    email: 'test@email.com',
    name: 'Test Name'
  };

  describe('POST', () => {
    it(`should create: ${entityName}`, async () => {
      const res = await integrationHelper.app.post(route).send(userRequest);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('name');
      expect(res.body.name).to.equal('Test Name');
      expect(res.body).to.have.property('email');
      expect(res.body.email).to.equal('test@email.com');
    });
    it(`should FAIL to create: ${entityName}`, async () => {
      const res = await integrationHelper.app.post(route).send({});
      expect(res.status).to.equal(400);
    });
  });

  // describe('PUT /{id}', () => {
  //   it(`should update: ${entityName}`, async () => {
  //     model.name = `${model.name}_edited`;
  //     const res = await app.put(`${route}/${model.id}`).send(model);
  //     expect(res.status).to.equal(200);
  //     model = res.body;
  //   });
  //   it(`should FAIL to update: ${entityName}`, async () => {
  //     const res = await app.put(`${route}/${model.id}`).send({});
  //     expect(res.status).to.equal(400);
  //   });
  // });

  // describe('GET', () => {
  //   it(`should get paginated: ${entityName}`, async () => {
  //     const res = await app.get(
  //       `${route}?page=1&limit=1&sort={"email":"asc"}&fields=email&q={"email":"${model.email}"}`
  //     );
  //     integrationHelper.testPagination(res);
  //   });
  //   it(`should FAIL to get paginated: ${entityName}`, async () => {
  //     const res = await app.get(route);
  //     expect(res.status).to.equal(400);
  //   });
  // });

  describe('GET /{id}', () => {
    it(`should get one: ${entityName}`, async () => {
      // const res = await app.get(`${route}/${request.id}`);
      // expect(res.status).to.equal(200);
      // expect(res.body).to.deep.equal(model);
    });
    it(`should FAIL to get one: ${entityName}`, async () => {
      let res = await integrationHelper.app.get(`${route}/11111111`);
      expect(res.status).to.equal(404);

      res = await integrationHelper.app.get(`${route}/dummy`);
      expect(res.status).to.equal(400);
    });
  });

  // describe('DELETE /{id}', () => {
  //   it(`should delete one: ${entityName}`, async () => {
  //     const res = await app.delete(`${route}/${model.id}`);
  //     expect(res.status).to.equal(204);
  //   });
  //   it(`should FAIL to delete one: ${entityName}`, async () => {
  //     const res = await app.delete(`${route}/${model.id}`);
  //     expect(res.status).to.equal(404);
  //   });
  // });
});
