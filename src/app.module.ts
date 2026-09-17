import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { ProjectService } from './project/project.service';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, ProjectModule, TaskModule],
  controllers: [AppController, ProjectController, TaskController],
  providers: [AppService, PrismaService, ProjectService, TaskService],
})
export class AppModule {}
