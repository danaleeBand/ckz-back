import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceUser } from '../entities/workspace-user.entity';

@Injectable()
export class WorkspaceUserService {
  constructor(
    @InjectRepository(WorkspaceUser)
    private workspaceUserRepository: Repository<WorkspaceUser>,
  ) {}

  async createWorkspaceUser(userId: number, workspaceId: number) {
    const workspaceUser = new WorkspaceUser();
    workspaceUser.user_id = userId;
    workspaceUser.workspace_id = workspaceId;
    const newWorkspaceUser =
      await this.workspaceUserRepository.save(workspaceUser);
    return newWorkspaceUser.id;
  }
}
