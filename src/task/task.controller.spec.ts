import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockTaskService = {
    createTask: jest.fn(),
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call taskService.createTask when createTask is called', async () => {
    const dto = {
      title: 'Build API',
      description: 'Create endpoint',
      status: 'PENDING',
      priority: 'MEDIUM',
    };

    await controller.createTask(dto as any, {} as any, 5);

    expect(taskService.createTask).toHaveBeenCalledWith(dto, 5);
  });

  it('should call taskService.getTasks when getTasks is called', async () => {
    const query = { page: 1, limit: 10 };

    await controller.getTasks({} as any, 5, query as any);

    expect(taskService.getTasks).toHaveBeenCalledWith(5, query);
  });

  it('should call taskService.getTaskById when getTaskById is called', async () => {
    await controller.getTaskById({} as any, 5, 7);

    expect(taskService.getTaskById).toHaveBeenCalledWith(7, 5);
  });

  it('should call taskService.updateTask when updateTask is called', async () => {
    const dto = {
      title: 'Updated task',
      description: 'Updated description',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    };

    await controller.updateTask({} as any, 5, 7, dto as any);

    expect(taskService.updateTask).toHaveBeenCalledWith(7, dto, 5);
  });

  it('should call taskService.deleteTask when deleteTask is called', async () => {
    await controller.deleteTask({} as any, 5, 7);

    expect(taskService.deleteTask).toHaveBeenCalledWith(7, 5);
  });
});
