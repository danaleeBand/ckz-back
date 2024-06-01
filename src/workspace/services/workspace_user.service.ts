import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WorkspaceUser } from '../entities/workspace-user.entity';
import { User } from '../../user/user.entity';
import { Workspace } from '../entities/workspace.entity';

@Injectable()
export class WorkspaceUserService {
  constructor(
    @InjectRepository(WorkspaceUser)
    private workspaceUserRepository: Repository<WorkspaceUser>,
  ) {}

  async createWorkspaceUser(
    user: User,
    workspace: Workspace,
    manager?: EntityManager,
  ) {
    const workspaceUser = new WorkspaceUser();
    workspaceUser.user = user;
    workspaceUser.workspace = workspace;
    if (manager) {
      return manager.save(workspaceUser);
    }
    return this.workspaceUserRepository.save(workspaceUser);
  }
}
