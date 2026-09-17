import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: {
    task: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const dto = {
      title: 'Build API',
      description: 'Create endpoint',
      status: 'PENDING',
      priority: 'MEDIUM',
    };

    prismaService.task.create.mockResolvedValueOnce({
      id: 1,
      ...dto,
      projectId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.createTask(dto as any, 5);

    expect(prismaService.task.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        project: {
          connect: {
            id: 5,
          },
        },
      },
    });

    expect(result).toEqual({
      id: 1,
      ...dto,
      projectId: 5,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should get tasks with filters and pagination', async () => {
    prismaService.task.findMany.mockResolvedValueOnce([
      { id: 1, title: 'Build API', description: 'Create endpoint', status: 'PENDING', priority: 'MEDIUM', projectId: 5 },
    ]);
    prismaService.task.count.mockResolvedValueOnce(1);

    const result = await service.getTasks(5, {
      page: 1,
      limit: 10,
      status: 'PENDING',
      priority: 'MEDIUM',
      sortBy: 'createdAt',
      order: 'desc',
    } as any);

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        projectId: 5,
        status: 'PENDING',
        priority: 'MEDIUM',
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 10,
    });

    expect(result).toEqual({
      data: [
        { id: 1, title: 'Build API', description: 'Create endpoint', status: 'PENDING', priority: 'MEDIUM', projectId: 5 },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  });
});
