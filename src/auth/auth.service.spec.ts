import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: {
      user: {
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
      };
  };
  let jwtService: {
      signAsync: jest.Mock;
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: prismaService }, { provide: JwtService, useValue: jwtService }],
    }).compile();

    service = module.get<AuthService>(AuthService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      const dto = { name: 'name', email: 'email', password: 'password' };
      prismaService.user.findUnique.mockResolvedValueOnce({ id: 1, ...dto });
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });


    it('should create a new user', async () => {
      const dto = { name: 'name', email: 'email', password: 'password' };
      prismaService.user.findUnique.mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
      prismaService.user.create.mockResolvedValueOnce({
        id: 1, name: dto.name,
        email: dto.email,
        password: 'hashedPassword',
      });
      const result = await service.register(dto);
      expect(result).toEqual({ name: 'name', email: 'email' });
    });
  });
  describe('login', () => {
    it('should throw ConflictException if user not found', async () => {
      const dto = { email: 'email', password: 'password' };
      prismaService.user.findUnique.mockResolvedValueOnce(null);
      await expect(service.logIn(dto)).rejects.toThrow(ConflictException);
    });
    it('should throw ConflictException if password is invalid', async () => {
      const dto = { email: 'email', password: 'password' };
      prismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: dto.email, password: 'hashedPassword' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      await expect(service.logIn(dto)).rejects.toThrow(ConflictException);
    });
    it('should return user and token if login is successful', async () => {
      const dto = { email: 'email', password: 'password' };
      prismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: dto.email, password: 'hashedPassword' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jwtService.signAsync.mockResolvedValueOnce('token');
      const result = await service.logIn(dto);
      expect(result).toEqual({
        user: { id: 1, email: dto.email, password: 'hashedPassword' },
        token: 'token',
      });
    }
    );
  });

  describe('me', () => {
    it('should return user if found', async () => {
      const userId = 1;
      prismaService.user.findUnique.mockResolvedValueOnce({ id: userId, name: 'name', email: 'email' });
      const result = await service.me(userId);
      expect(result).toEqual({ id: userId, name: 'name', email: 'email' });
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated user', async () => {
      const userId = 1;
      const dto = { name: 'newName', email: 'newEmail', password: 'newPassword' };
      prismaService.user.findUnique.mockResolvedValueOnce({ id: userId, name: 'oldName', email: 'oldEmail', password: 'pass' });
      prismaService.user.update.mockResolvedValueOnce({ id: userId, ...dto });
      const result = await service.updateUser(userId, dto);
      expect(result).toEqual({ id: userId, ...dto });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return deleted user', async () => {
      const userId = 1;
      prismaService.user.findUnique.mockResolvedValueOnce({ id: userId, name: 'name', email: 'email', password: 'pass' });
      prismaService.user.delete.mockResolvedValueOnce({ id: userId, name: 'name', email: 'email', password: 'pass' });
      const result = await service.deleteuser(userId);
      expect(result).toEqual({ id: userId, name: 'name', email: 'email', password: 'pass' });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
