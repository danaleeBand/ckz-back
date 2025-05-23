import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private readonly dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async createPermission(
    userId: number,
    code: string,
    manager: EntityManager,
  ): Promise<Permission> {
    const permission = this.create({
      user: {
        id: userId,
      },
      code,
    });

    return manager.save(permission);
  }
}
