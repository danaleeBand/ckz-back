import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WorkspaceUser } from '../entities/workspace-user.entity';
import { User } from '../../user/user.entity';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceUserRepository } from '../repositories/workspace-user.repository';

@Injectable()
export class WorkspaceUserService {
  constructor(private workspaceUserRepository: WorkspaceUserRepository) {}

  async createWorkspaceUser(
    workspaceId: number,
    userId: number,
    manager: EntityManager,
  ): Promise<void> {
    await this.workspaceUserRepository.createWorkspaceUser(
      workspaceId,
      userId,
      manager,
    );
  }
}
