import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { projectDtos } from './dto/project.dto.js';
import { Project, Prisma } from "../../generated/prisma/client.js"

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) {}

    async createProject(dto: projectDtos, userId: number): Promise<Project> {
        const project = await this.prisma.project.create({
            data: {
                name: dto.name,
                description: dto.description,
                userId: userId,
            },
        });
        return project;
    }

    async getProjects(userId: number, query: any): Promise<any> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const where: any = {
            userId,
        };

        if (query.name) {
            where.name = {
                contains: query.name,
                mode: 'insensitive',
            };
        }

        const orderBy: any = {
            [query.sortBy ?? 'createdAt']: query.order ?? 'desc',
        };

        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.project.count({ where }),
        ]);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getProjectById(projectId: number, userId: number): Promise<Project | null> {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                userId: userId,
            },
        });
        return project;
    }

    async updateProject(projectId: number, dto: projectDtos, userId: number): Promise<Project> {
        const project = await this.prisma.project.update({
            where: {
                id: projectId,
                userId: userId,
            },
            data: {
                name: dto.name,
                description: dto.description,
            },
        });
        return project;
    }   

    async deleteProject(projectId: number, userId: number): Promise<void> {
        await this.prisma.project.delete({
            where: {
                id: projectId,
                userId: userId,
            },
        });

    }

}
