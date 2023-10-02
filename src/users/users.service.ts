import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput} from './dto/create-user.input';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
    
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findUserById(id: number): Promise<User> {
        return this.usersRepository.findOne({
            where: {
                id
            }
        });
    }

    createUser(user: CreateUserInput): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}
