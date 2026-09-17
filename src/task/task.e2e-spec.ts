import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('Task e2e', () => {
  let app: INestApplication;
  let token: string;
  let projectId: number;

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
        email: 'task-user@test.com',
        password: 'secret123',
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/logIn')
      .send({
        email: 'task-user@test.com',
        password: 'secret123',
      });

    token = loginResponse.body.token;

    const projectResponse = await request(app.getHttpServer())
      .post('/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Task Project',
        description: 'Project for task tests',
      });

    projectId = projectResponse.body.id;
  });

  it('POST /task/:projectId should create a task', async () => {
    const response = await request(app.getHttpServer())
      .post(`/task/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Write API',
        description: 'Implement the endpoint',
        status: 'PENDING',
        priority: 'MEDIUM',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Write API');
  });

  it('GET /task/:projectId should return tasks', async () => {
    const response = await request(app.getHttpServer())
      .get(`/task/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
