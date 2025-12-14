import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async signUp(createUserDto: CreateUserDto) {

        try {
            const newUser = this.usersRepository.create({ ...createUserDto });
            const user = await this.usersRepository.save(newUser)
            return user

        } catch (error) {
            if (error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062) 
            {
                throw new ConflictException({ success: false, message: "User is already exit" });
            }
            throw error
        }
    }

    async findUser(email: string){
        const user = await this.usersRepository.findOneBy({email: email})
        return user
    }

    async findUserById(id: number){
        const user = await this.usersRepository.findOneBy({id: id})
        return user
    }

    async resetUserPassword(email: string, password: string){
        const user = await this.usersRepository.update({email: email}, {password: password})
        return user
    }

    async verifyUser(email: string, isVerified: boolean){
        if(isVerified) {
            return null
        }
        
        await this.usersRepository.update({email: email}, {isVerified : true})

        return { success: true, message: 'User verified successfully' };
    }

    async twofaEnabled(id: number){
        const user = await this.findUserById(id)
        const twofa = !user?.twoFactorEnabled
        
        await this.usersRepository.update({id: id}, {twoFactorEnabled : !user?.twoFactorEnabled})

        return
    }
    async nameChangeUser(id:number, name: string){
        
        await this.usersRepository.update({id: id}, {name : name})

        return
    }
    async imageSave(id: number ,result: any){
        await this.usersRepository.update({id: id}, {profilePic: result.secure_url, cloudinaryId: result.public_id})
        return
    }
}
