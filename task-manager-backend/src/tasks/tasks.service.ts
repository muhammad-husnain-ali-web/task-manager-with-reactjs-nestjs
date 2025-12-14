import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
            private tasksRepository: Repository<Task>,
  ){}

  async create(createTaskDto: CreateTaskDto, request: any) {
    const newTask = this.tasksRepository.create({ ...createTaskDto, user :request.user.id });
    await this.tasksRepository.save(newTask)
    return { success: true, message: "Task Saved Successfully" }
  }

  async findAll(request: any) {
    const tasks = await this.tasksRepository.findBy({user: { id: request.user.id },})
    return { success: true, tasks };
  }



  async findOne(id: number, request: any) {
    const task = await this.tasksRepository.findOne({ where: { id: id, user: { id: request.user.id }, }, });
    return { success: true, task };
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, request: any) {
    const result = await this.tasksRepository.update({id: id, user: { id: request.user.id }, }, {...updateTaskDto}) 
    return { success: true, message: "Task Updated Successfully",  result };
  }


  async remove(id: number, request: any) {
    const result = await this.tasksRepository.delete({id: id,  user: { id: request.user.id },})
    return { success: true, message: "Task Deleted Successfully", result };
  }
}
