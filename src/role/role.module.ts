import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), TypeOrmModule.forFeature([User]), forwardRef(() => UsersModule)],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
