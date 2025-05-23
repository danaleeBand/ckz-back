import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WorkspaceUser } from '../entities/workspace-user.entity';

@Injectable()
export class WorkspaceUserRepository extends Repository<WorkspaceUser> {
  constructor(private readonly dataSource: DataSource) {
    super(WorkspaceUser, dataSource.createEntityManager());
  }

  async createWorkspaceUser(
    workspaceId: number,
    userId: number,
    manager: EntityManager,
  ): Promise<void> {
    const workspaceUser = this.create({
      workspace: {
        id: workspaceId,
      },
      user: { id: userId },
    });

    await manager.save(workspaceUser);
  }
}
