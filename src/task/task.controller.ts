import { Controller, UseGuards, Body, Req, Post, Get, Param, ParseIntPipe, Delete, Patch, Query, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { taskDtos, taskQueryDto } from './dtos/task.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Task } from 'generated/prisma/client';


@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Post(':projectId')
    createTask(@Body() dto: taskDtos, @Req() req: any, @Param('projectId', ParseIntPipe) projectId: number): Promise<Task> {
        return this.taskService.createTask(dto, projectId);
    }

    @Get(':projectId')
    getTasks(
        @Req() req: any,
        @Param('projectId', ParseIntPipe) projectId: number,
        @Query(new ValidationPipe({ transform: true })) query: taskQueryDto,
    ): Promise<any> {
        return this.taskService.getTasks(projectId, query);
    }

    @Get(':projectId/:taskId')
    getTaskById(@Req() req: any, @Param('projectId', ParseIntPipe) projectId: number, @Param('taskId', ParseIntPipe) taskId: number): Promise<Task | null> {
        return this.taskService.getTaskById(taskId, projectId);
    }

    @Patch(':projectId/:taskId')
    updateTask(@Req() req: any, @Param('projectId', ParseIntPipe) projectId: number, @Param('taskId', ParseIntPipe) taskId: number, @Body() dto: taskDtos): Promise<Task> {
        return this.taskService.updateTask(taskId, dto, projectId);
    }

    @Delete(':projectId/:taskId')
    deleteTask(@Req() req: any, @Param('projectId', ParseIntPipe) projectId: number, @Param('taskId', ParseIntPipe) taskId: number): Promise<Task> {
        return this.taskService.deleteTask(taskId, projectId);
    }
}

