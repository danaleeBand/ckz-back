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

  async createWorkspace(name: string, manager?: EntityManager) {
    const workspace = new Workspace();
    workspace.name = name;
    if (manager) {
      return manager.save(workspace);
    }
    return this.workspaceRepository.save(workspace);
  }

  async findById(workspaceId: number) {
    return this.workspaceRepository.findOne({
      where: { id: workspaceId },
      select: ['name', 'folder_order'],
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
    manager?: EntityManager,
  ) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    if (!workspace.folder_order) {
      workspace.folder_order = [];
    }

    if (!workspace.folder_order.includes(folderId)) {
      workspace.folder_order.push(folderId);

      if (manager) {
        await manager.save(workspace);
      }

      await this.workspaceRepository.save(workspace);
    }
  }
}
