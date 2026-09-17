
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';




describe('Auth', () => {
  let app: INestApplication;
  let authService = {
    register: jest.fn(),
    logIn: jest.fn(),
    me: jest.fn(),
    updateUser: jest.fn(),
    deleteuser: jest.fn(),
  };

  let token: string;
  let uniqueEmail = `testuser_${Date.now()}@example.com`; // Generate a unique email for each test run

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
    .overrideProvider(AuthService)
    .useValue(authService)
    .compile();
    //not overiding the auth service need a real login flow


    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const dto = { name: 'name', email: uniqueEmail, password: 'password' };


      authService.register.mockResolvedValueOnce({ name: dto.name, email: dto.email });
      const response = await request(app.getHttpServer()).post('/auth/register').send(dto);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ name: dto.name, email: dto.email });
    });
    it('should return 409 if email already exists', async () => {
      const dto = { name: 'name', email: uniqueEmail, password: 'password' };
      authService.register.mockRejectedValueOnce(new Error('Email already exists'));
      const response = await request(app.getHttpServer()).post('/auth/register').send(dto);
      expect(response.status).toBe(409);
    });
  });

    describe('POST /auth/logIn', () => {
      it('should log in a user', async () => {
        const dto = { email: uniqueEmail, password: 'password' };
        authService.logIn.mockResolvedValueOnce({ user: { id: 1, email: dto.email, password: 'hashedPassword' }, token: 'token' });
        const response = await request(app.getHttpServer()).post('/auth/logIn').send(dto);

    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ user: { id: 1, email: dto.email, password: 'hashedPassword' }, token: 'token' });
        token = response.body.token;
      });
      it('should return 409 if user not found', async () => {
        const dto = { email: uniqueEmail, password: 'password' };
        authService.logIn.mockRejectedValueOnce(new Error('User not found'));
        const response = await request(app.getHttpServer()).post('/auth/logIn').send(dto);
        expect(response.status).toBe(409);
      });
    });

    describe('GET /auth/me', () => {
      it('should return the authenticated user', async () => {
        const userId = 1;
        authService.me.mockResolvedValueOnce({ id: userId, name: 'name', email: uniqueEmail });
        const response = await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: userId, name: 'name', email: uniqueEmail });
      });
      it('should return 401 if user not found', async () => {
        authService.me.mockRejectedValueOnce(new Error('User not found'));
        const response = await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
      });
      it('should return 401 if no token is provided', async () => {
        const response = await request(app.getHttpServer()).get('/auth/me');
        expect(response.status).toBe(401);
      });
      it('should return 401 if an invalid token is provided', async () => {
        const response = await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer invalidtoken`);
        expect(response.status).toBe(401);
      });
    });

    describe('PUT /auth/updateUser', () => {
      it('should update the authenticated user', async () => {
        const dto = { name: 'newName', email: uniqueEmail, password: 'newPassword' };    
        authService.updateUser.mockResolvedValueOnce({ id: 1, ...dto });
        const response = await request(app.getHttpServer()).put('/auth/updateUser').send(dto).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, ...dto });
      });
      it('should return 401 if user not found', async () => {
        const dto = { name: 'newName', email: uniqueEmail, password: 'newPassword' };
        authService.updateUser.mockRejectedValueOnce(new Error('User not found'));
        const response = await request(app.getHttpServer()).put('/auth/updateUser').send(dto).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
      });
    });

    describe('DELETE /auth/deleteUser', () => {
      it('should delete the authenticated user', async () => {
        authService.deleteuser.mockResolvedValueOnce({ message: 'User deleted successfully' });    
        const response = await request(app.getHttpServer()).delete('/auth/deleteUser').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted successfully' });
      });
      it('should return 401 if user not found', async () => {
        authService.deleteuser.mockRejectedValueOnce(new Error('User not found'));
        const response = await request(app.getHttpServer()).delete('/auth/deleteUser').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
      });
    });

  afterAll(async () => {
    await app.close();
  });
});
