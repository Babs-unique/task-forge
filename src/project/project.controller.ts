import { Controller, UseGuards, Body, Req, Post, Get, Param, ParseIntPipe, Delete, Patch, Query, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ProjectService } from './project.service';
import { projectDtos } from './dto/project.dto.js';
import { projectQueryDto } from './dto/projecQuery.dto';
import { Project } from "../../generated/prisma/client.js"
import type { Request } from 'express';


type AuthenticatedRequest = Request & {
    user: {
        sub: number;
    };
};

@Controller('project')
@UseGuards(AuthGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    createProject(@Body() dto: projectDtos, @Req() req: AuthenticatedRequest): Promise<Project> {
        const userId = req.user.sub;
        return this.projectService.createProject(dto, userId);
    }
    
    @Get()
    getProjects(
        @Req() req: AuthenticatedRequest,
        @Query(new ValidationPipe({ transform: true })) query: projectQueryDto,
    ): Promise<any> {
        const userId = req.user.sub;
        return this.projectService.getProjects(userId, query);
    }

    @Get(':id')
    getProjectById(@Param('id' , ParseIntPipe) id: number, @Req() req: AuthenticatedRequest): Promise<Project | null> {
        const userId = req.user.sub;
        return this.projectService.getProjectById(id, userId);
    }

    @Patch(':id')
    updateProject(@Param('id' , ParseIntPipe) id: number, @Body() dto: projectDtos, @Req() req: AuthenticatedRequest): Promise<Project> {
        const userId = req.user.sub;
        return this.projectService.updateProject(id, dto, userId);
    }

    @Delete(':id')
    deleteProject(@Param('id' , ParseIntPipe) id: number, @Req() req: AuthenticatedRequest): Promise<void> {
        const userId = req.user.sub;
        return this.projectService.deleteProject(id, userId);
    }
}
