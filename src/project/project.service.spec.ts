import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prismaService: {
    project: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project', async () => {
    const dto = { name: 'Project A', description: 'Some description' };
    prismaService.project.create.mockResolvedValueOnce({
      id: 1,
      name: dto.name,
      description: dto.description,
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.createProject(dto as any, 3);

    expect(prismaService.project.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        description: dto.description,
        userId: 3,
      },
    });
    expect(result).toEqual({
      id: 1,
      name: dto.name,
      description: dto.description,
      userId: 3,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should get projects with filters and pagination', async () => {
    prismaService.project.findMany.mockResolvedValueOnce([
      { id: 1, name: 'Project A', description: 'desc', userId: 3 },
    ]);
    prismaService.project.count.mockResolvedValueOnce(1);

    const result = await service.getProjects(3, {
      page: 1,
      limit: 10,
      name: 'Project',
      sortBy: 'createdAt',
      order: 'desc',
    } as any);

    expect(prismaService.project.findMany).toHaveBeenCalledWith({
      where: {
        userId: 3,
        name: {
          contains: 'Project',
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 10,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'Project A', description: 'desc', userId: 3 }],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  });
});
