import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserInput } from './dto/register-user.input';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUserInput } from './dto/login-user.input';
import { RecoveryUserInput, ValidateRecoveryUserInput } from './dto/recovery-user.input.';
import { ChangePassUserInput, UpdateUserInput } from './dto/update-user.input';
import { AddTeamInput } from './dto/add-team.input';
import { DeleteTeamFromUserInput } from './dto/delete-team-from-user.input';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private usersRepository: Repository<User>,
    ) {}
    
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findRecoveryPass(): Promise<number>{
        const recoveryPass = Math.floor(100000 + Math.random() * 900000);
        const user = await this.usersRepository.findOne({
            where: {
                recoveryPass
            }
        });
        if(!user){
            return recoveryPass;
        }else{
            return this.findRecoveryPass();
        }
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

    async login(loginInput: LoginUserInput): Promise<User>{
        const email = loginInput.email;
        const password = loginInput.password;
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })
        if(!user){
            throw new Error('user does not exist');
        }
        const valid = await bcrypt.compare(password, user.password);
        
        if(!valid){
            throw new Error('incorrect password');
        }
        user.accessToken = jwt.sign({email,password}, 'quicktask');
        await this.usersRepository.save(user);
        return user;
    }

    async sendRecoveryEmail(recoveryUserInput: RecoveryUserInput): Promise<User> {
        const email = recoveryUserInput.email;
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })
        if(!user){
            throw new Error('user does not exist');
        }

        const nodemailer = require('nodemailer');
        const client = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const recoveryPass = await this.findRecoveryPass();

        client.sendMail(
            {
                from: '"Quick Task" <noreply@example.com>',
                to: email,
                subject: "Codigo de recuperacion de contraseña",
                text: "Estimado " + user.name + " " + user.lastName + " su codigo de recuperacion de contraseña es: " + recoveryPass,
            },
            (error) => {
                if (error) {
                    throw new Error('email could not be sent');
                } else {
                    console.log('Email sent');
                    user.recoveryPass = recoveryPass;
                    this.usersRepository.save(user);
                }
            }
        );
        return user;
    }
    
    async validateRecovery(validateRecoveryInput: ValidateRecoveryUserInput): Promise<User> {
        const recoveryPass = validateRecoveryInput.recoveryPass;
        const user = await this.usersRepository.findOne({
            where: {recoveryPass}
        })
        if(!user){
            throw new Error('incorrect recovery code');
        }else{
            await this.usersRepository.save(user);
            return user;
        }
    }

    async changePass(changePassUserInput: ChangePassUserInput): Promise<User> {
        const newPassword = changePassUserInput.password;
        const recoveryPass = changePassUserInput.recoveryPass;
        const user = await this.usersRepository.findOne({
            where: {
                recoveryPass
            }
        })

        const same = await bcrypt.compare(newPassword, user.password);

        if(same){
            throw new Error('same password');
        }else{
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.recoveryPass = null;
            await this.usersRepository.save(user);
            return user;
        }
    }

    async addTeam(addTeamInput: AddTeamInput): Promise<User>{
        const idUser = addTeamInput.idUser;
        const idTeam = addTeamInput.idTeam;
        const user = await this.usersRepository.findOne({
            where: {
                id: idUser
            }
        })

        if(!user){
            throw new Error('user does not exist');
        }else{
            if (!user.idTeams) {
                user.idTeams = [idTeam];
                await this.usersRepository.save(user);
                return user;
            }else{
                const exist = await user.idTeams.find(id => id === idTeam);
                if(exist){
                    throw new Error('team already added');
                }else{
                    user.idTeams.push(idTeam);
                    await this.usersRepository.save(user);
                    return user;
                }
            }
        }
    }

    async deleteTeam(deleteTeamFromUserInput: DeleteTeamFromUserInput): Promise<User>{
        const idUser = deleteTeamFromUserInput.idUser;
        const idTeam = deleteTeamFromUserInput.idTeam;
        const user = await this.usersRepository.findOne({
            where: {
                id: idUser
            }
        })

        if(!user){
            throw new Error('user does not exist');
        }else{
            if (!user.idTeams) {
                throw new Error('team list is empty');
            }else{
                const exist = await user.idTeams.find(id => id === idTeam);
                if(!exist){
                    throw new Error('team does not exist');
                }else{
                    user.idTeams = user.idTeams.filter(id => id !== idTeam);
                    await this.usersRepository.save(user);
                    return user;
                }
            }
        }
    }

    async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
        const oldEmail = updateUserInput.oldEmail;
        const user = await this.usersRepository.findOne({
            where: {
                email: oldEmail
            }
        })

        if(!user){
            throw new Error('user does not exist');
        }else{
            if(updateUserInput.name){
                user.name = updateUserInput.name;
            }
            if(updateUserInput.lastName){
                user.lastName = updateUserInput.lastName;
            }
            if(updateUserInput.email){
                user.email = updateUserInput.email;
            }
            await this.usersRepository.save(user);
            return user;
        }
    }
}
