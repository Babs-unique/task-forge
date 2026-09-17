import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma } from "../../generated/prisma/client.js"
import { userDtos } from './dtos/user.dtos.js'
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
) {}

    async register(dto: userDtos ): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (user) {
            throw new ConflictException('Email already exists');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name as string,
                email: dto.email,
                password: hashPassword,
            },
        });

        return {
            name: newUser.name,
            email: newUser.email
        };

    }

    async logIn(dto: userDtos): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new ConflictException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new ConflictException('Invalid Credentials');
        }

        const payload = { email: user.email, sub: user.id };
        const token = await this.jwtService.signAsync(payload);

        return {
            user,
            token
        };
    }

    async me(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new ConflictException('User not found');
        }
        return user;
    }


    async updateUser(userId: number, dto: userDtos): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new ConflictException('User not found');
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: dto.name as string,
                email: dto.email,
            },
        });
        return updatedUser;
    }

    async deleteuser(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new ConflictException('User not found');
        }
        const deletedUser = await this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
        return deletedUser;
    }
}
