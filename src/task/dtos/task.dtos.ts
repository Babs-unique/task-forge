import { Type } from 'class-transformer';
import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';

enum Status {
    pending = 'PENDING',
    in_progress = 'IN_PROGRESS',
    completed = 'COMPLETED',
}

enum Priority {
    low = 'LOW',
    medium = 'MEDIUM',
    high = 'HIGH',
}

export class taskDtos {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsEnum(Status, { message: 'Status must be one of the following values: pending, in_progress, completed' })
    status?: Status;

    @IsString()
    @IsEnum(Priority, { message: 'Priority must be one of the following values: low, medium, high' })
    priority?: Priority;
}

export class taskQueryDto {
    @IsOptional()
    @IsEnum(Status, { message: 'Status must be one of the following values: pending, in_progress, completed' })
    status?: Status;

    @IsOptional()
    @IsEnum(Priority, { message: 'Priority must be one of the following values: low, medium, high' })
    priority?: Priority;

    @IsOptional()
    @IsEnum(['createdAt', 'priority', 'status'])
    sortBy?: 'createdAt' | 'priority' | 'status';

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
