import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceUser } from '../entities/workspace-user.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceUser)
    private readonly userWorkspaceRepository: Repository<WorkspaceUser>,
  ) {}

  async createWorkspace(
    name: string,
    permissionCode: string,
    manager?: EntityManager,
  ) {
    const workspace = new Workspace();
    workspace.name = name;
    workspace.permission_code = permissionCode;
    if (manager) {
      return manager.save(workspace);
    }
    return this.workspaceRepository.save(workspace);
  }

  async findById(workspaceId: number) {
    return this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
  }

  async findByUserId(userId: number) {
    return this.userWorkspaceRepository.find({
      where: { user: { id: userId } },
      relations: ['workspace'],
    });
  }

  async addFolderToWorkspaceOrder(
    workspaceId: number,
    folderId: number,
    manager: EntityManager,
  ) {
    const workspace = await manager.findOne(Workspace, {
      where: { id: workspaceId },
    });
    if (!workspace.folder_order.includes(folderId)) {
      workspace.folder_order.push(folderId);
      await manager.save(workspace);
    }
  }
}
