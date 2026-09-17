import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should allow valid bearer token', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ sub: 1, email: 'a@b.com' }),
    };

    const guard = new AuthGuard(jwtService as unknown as JwtService);
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer token' },
          user: undefined,
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token');
  });

  it('should reject missing token', async () => {
    const guard = new AuthGuard({ verifyAsync: jest.fn() } as unknown as JwtService);
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
