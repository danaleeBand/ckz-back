import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../user/user.entity';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async createPermission(userId: number, manager: EntityManager) {
    const permissionCode = crypto.randomUUID();

    const permission = await this.permissionRepository.createPermission(
      userId,
      permissionCode,
      manager,
    );

    return permission.code;
  }
}
