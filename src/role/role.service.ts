import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<Role[]> {
        return this.rolesRepository.find();
    }

    async findRoleById(id: number): Promise<Role> {
        const exist = await this.rolesRepository.findOne({
            where: {
                id
            }
        });
        if (!exist) {
            throw new Error('El rol no existe');
        } else {
            return exist;
        }
    }

    async createRole(name: string): Promise<Role> {
        const roleExists = await this.rolesRepository.findOne({
            where: {
                name
            }
        });
        if (roleExists) {
            throw new Error('El rol ya existe');
        } else {
            const role = new Role();
            role.name = name;
            return this.rolesRepository.save(role);
        }
    }

    async updateRole(id: number, name: string): Promise<boolean> {
        const roleExists = await this.rolesRepository.findOne({
            where: {
                id
            }
        });
        if (!roleExists) {
            throw new Error('El rol no existe');
        } else {
            const roleNameExists = await this.rolesRepository.findOne({
                where: {
                    name
                }
            });
            if (roleNameExists) {
                throw new Error('El nombre del rol ya existe');
            } else {
                roleExists.name = name;
                await this.rolesRepository.save(roleExists);
                return true;
            }
        }
    }

    async deleteRole(id: number): Promise<boolean> {
        const roleExists = await this.rolesRepository.findOne({
            where: { id },
        });
    
        if (!roleExists) {
            throw new Error('El rol no existe');
        }
    
        const usersWithRole = await this.usersRepository.find({
            where: { role: { id } },
        });
    
        if (usersWithRole.length > 0) {
            // Actualizar usuarios antes de eliminar el rol
            for (const user of usersWithRole) {
                user.role = null;
                await this.usersRepository.save(user);
            }
        }
    
        await this.rolesRepository.remove(roleExists);
        return true;
    }
}
