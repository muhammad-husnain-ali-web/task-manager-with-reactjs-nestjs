import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/guards/auth/guards/auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, request);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.tasksService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.tasksService.findOne(id, request);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto, request);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request,) {
    return this.tasksService.remove(id, request);
  }
}
