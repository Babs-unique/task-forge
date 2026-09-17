import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('ProjectController', () => {
  let controller: ProjectController;
  let projectService: ProjectService;

  const mockProjectService = {
    createProject: jest.fn(),
    getProjects: jest.fn(),
    getProjectById: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call projectService.createProject when createProject is called', async () => {
    const dto = { name: 'Project A', description: 'Some description' };
    const req = { user: { sub: 1 } };

    await controller.createProject(dto as any, req as any);

    expect(projectService.createProject).toHaveBeenCalledWith(dto, 1);
  });

  it('should call projectService.getProjects when getProjects is called', async () => {
    const query = { page: 1, limit: 10 };
    const req = { user: { sub: 1 } };

    await controller.getProjects(req as any, query as any);

    expect(projectService.getProjects).toHaveBeenCalledWith(1, query);
  });

  it('should call projectService.getProjectById when getProjectById is called', async () => {
    const req = { user: { sub: 1 } };

    await controller.getProjectById(5, req as any);

    expect(projectService.getProjectById).toHaveBeenCalledWith(5, 1);
  });

  it('should call projectService.updateProject when updateProject is called', async () => {
    const dto = { name: 'Updated', description: 'New desc' };
    const req = { user: { sub: 1 } };

    await controller.updateProject(5, dto as any, req as any);

    expect(projectService.updateProject).toHaveBeenCalledWith(5, dto, 1);
  });

  it('should call projectService.deleteProject when deleteProject is called', async () => {
    const req = { user: { sub: 1 } };

    await controller.deleteProject(5, req as any);

    expect(projectService.deleteProject).toHaveBeenCalledWith(5, 1);
  });
});
