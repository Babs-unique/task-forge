import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('Project e2e', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Alice',
        email: 'project-user@test.com',
        password: 'secret123',
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/logIn')
      .send({
        email: 'project-user@test.com',
        password: 'secret123',
      });

    token = loginResponse.body.token;
  });

  it('POST /project should create a project', async () => {
    const response = await request(app.getHttpServer())
      .post('/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Project',
        description: 'Project description',
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('My Project');
  });

  it('GET /project should return project list', async () => {
    const response = await request(app.getHttpServer())
      .get('/project')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
