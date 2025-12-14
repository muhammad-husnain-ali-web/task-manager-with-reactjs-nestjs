import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @MinLength(10, { message: 'Title must be at least 2 character long' })
    title: string;

    @IsOptional()
    description: string;

}
