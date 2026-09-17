import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    logIn: jest.fn(),
    me: jest.fn(),
    updateUser: jest.fn(),
    deleteuser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
  test('should call authService.register when signUp is called', async () => {
    const dto = { name: 'name', email: 'email', password: 'password' };
    await controller.signUp(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  test('should call authService.logIn when signIn is called', async () => {
    const dto = { email: 'email', password: 'password' };
    await controller.signIn(dto);
    expect(authService.logIn).toHaveBeenCalledWith(dto);
  });

  test('should call authService.me when me is called', async () => {
    const req = { user: { sub: 1 } };
    await controller.me(req as any);
    expect(authService.me).toHaveBeenCalledWith(1);
  });

  test('should call authService.updateUser when updateUser is called', async () => {
    const req = { user: { sub: 1 } };
    const dto = { name: 'name', email: 'email', password: 'password' };
    await controller.updateUser(req as any, dto);
    expect(authService.updateUser).toHaveBeenCalledWith(1, dto);
  });

  test('should call authService.deleteuser when deleteUser is called', async () => {
    const req = { user: { sub: 1 } };
    await controller.deleteUser(req as any);
    expect(authService.deleteuser).toHaveBeenCalledWith(1);
  });


});
