import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RegisterUserInput } from './dto/register-user.input';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUserInput } from './dto/login-user.input';
import { RecoveryUserInput, ValidateRecoveryUserInput } from './dto/recovery-user.input.';
import { ChangePassRecoveryUserInput, ChangePassUserInput, UpdateUserInput } from './dto/update-user.input';
import { DeleteUserInput } from './dto/delete-user.input';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findRecoveryPass(): Promise<number> {
        const recoveryPass = Math.floor(100000 + Math.random() * 900000);
        const user = await this.usersRepository.findOne({
            where: {
                recoveryPass
            }
        });
        if (!user) {
            return recoveryPass;
        } else {
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
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new Error('El usuario no existe');
        }else{
            return user;
        }
    }

    async findUsersByIds(userIds: number[]): Promise<User[]> {
        return this.usersRepository.find({
            where: {
                id: In(userIds),
            },
        });
    }

    async registerUser(user: RegisterUserInput): Promise<User> {
        const email = user.email;
        const password = user.password;
        const name = user.name;
        const lastName = user.lastName;
        const userExists = await this.usersRepository.findOne({
            where: {
                email
            }
        })
        if (userExists) {
            throw new Error('Usuario con ese correo ya existe');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User();
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.name = name;
        newUser.lastName = lastName;
        newUser.accessToken = jwt.sign({ email, password }, 'quicktask');
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async login(loginInput: LoginUserInput): Promise<User> {
        const email = loginInput.email;
        const password = loginInput.password;
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new Error('user does not exist');
        }
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error('incorrect password');
        }
        user.accessToken = jwt.sign({ email, password }, 'quicktask');
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
        if (!user) {
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
                from: '"Soporte de Quick Task" <noreply@example.com>',
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
            where: { recoveryPass }
        })
        if (!user) {
            throw new Error('incorrect recovery code');
        } else {
            await this.usersRepository.save(user);
            return user;
        }
    }

    async changePassRecovery(changePassRecoveryUserInput: ChangePassRecoveryUserInput): Promise<User> {
        const newPassword = changePassRecoveryUserInput.password;
        const recoveryPass = changePassRecoveryUserInput.recoveryPass;
        const user = await this.usersRepository.findOne({
            where: {
                recoveryPass
            }
        })

        const same = await bcrypt.compare(newPassword, user.password);

        if (same) {
            throw new Error('same password');
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.recoveryPass = null;
            await this.usersRepository.save(user);
            return user;
        }
    }

    async changePassword(changePassInput: ChangePassUserInput): Promise<User> {
        const email = changePassInput.email;
        const oldPassword = changePassInput.oldPassword;
        const newPassword = changePassInput.newPassword;
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        })

        const valid = await bcrypt.compare(oldPassword, user.password);

        if (!valid) {
            throw new Error('incorrect password');
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await this.usersRepository.save(user);
            return user;
        }
    }

    async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
        const oldEmail = updateUserInput.oldEmail;
        const user = await this.usersRepository.findOne({
            where: {
                email: oldEmail
            }
        })

        if (!user) {
            throw new Error('user does not exist');
        } else {
            if (updateUserInput.name) {
                user.name = updateUserInput.name;
            }
            if (updateUserInput.lastName) {
                user.lastName = updateUserInput.lastName;
            }
            if (updateUserInput.email) {
                user.email = updateUserInput.email;
            }
            await this.usersRepository.save(user);
            return user;
        }
    }

    async deleteUser(deleteUserInput: DeleteUserInput): Promise<boolean> {
        const id = deleteUserInput.idUser;
        const password = deleteUserInput.password;
        const user = await this.usersRepository.findOne({
            where: {
                id
            }
        })

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error('Contraseña Incorrecta');
        } else {
            await this.usersRepository.delete(id);
            return true;
        }
    }
}
