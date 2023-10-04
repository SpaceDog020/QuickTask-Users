import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserInput } from './dto/register-user.input';
import * as bcrypt from 'bcrypt';

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

    async findUserByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({ 
            where: {
                email
            }
        });
    }

    async registerUser(user: RegisterUserInput): Promise<User> {
        const { password, ...userData } = user;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        });

        return this.usersRepository.save(newUser);
    }
}
