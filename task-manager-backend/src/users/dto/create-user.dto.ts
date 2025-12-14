import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(2, { message: 'Title must be at least 2 character long' })
    name: string;

    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @IsString()
    password: string
}
