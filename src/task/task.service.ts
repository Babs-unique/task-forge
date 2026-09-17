import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { taskDtos } from './dtos/task.dtos';
import { Task } from '../../generated/prisma/client.js'
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async createTask(dto: taskDtos, projectId: number): Promise<Task> {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                priority: dto.priority,
                project: {
                    connect: {
                        id: projectId
                    }
                },
            }
        });
    }

    async getTasks(projectId: number, query: any): Promise<any> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const where: any = {
            projectId,
        };

        if (query.status) {
            where.status = query.status;
        }

        if (query.priority) {
            where.priority = query.priority;
        }

        const orderBy: any = {
            [query.sortBy ?? 'createdAt']: query.order ?? 'desc',
        };

        const [data, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.task.count({ where }),
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

    async getTaskById(taskId: number, projectId: number): Promise<Task | null> {
        const task =  this.prisma.task.findFirst({
            where: {
                id: taskId,
                projectId,
            },
        });
        if(!task){
            throw new NotFoundException(`Task not found`);
        }
        return task;
    }

    async updateTask(taskId: number, dto: taskDtos, projectId: number): Promise<Task> {
        return this.prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                priority: dto.priority,
                projectId,
            }
        });
    }

    async deleteTask(taskId: number, projectId: number): Promise<Task> {
        return this.prisma.task.delete({
            where: {
                id: taskId,
            }
        });
    }
}
