import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(user: User, code?: string) {
    const permission = new Permission();
    permission.user = user;
    let permissionCode = code;
    if (!permissionCode) {
      permissionCode = crypto.randomUUID();
    }
    permission.code = permissionCode;
    await this.permissionRepository.save(permission);

    return permission.code;
  }
}
