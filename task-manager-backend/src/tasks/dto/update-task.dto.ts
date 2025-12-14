import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional, } from 'class-validator';
import { Status } from '../enum/status.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be one of: pending, in-progress, completed' })
  status?: Status;
}
