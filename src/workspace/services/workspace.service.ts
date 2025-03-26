import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly workspaceUserRepository: Repository<WorkspaceUser>,
  ) {}

  async createWorkspace(
    name: string,
    permissionCode: string,
    manager?: EntityManager,
  ) {
    const workspace = new Workspace();
    workspace.name = name;
    workspace.permissionCode = permissionCode;
    if (manager) {
      return manager.save(workspace);
    }
    return this.workspaceRepository.save(workspace);
  }

  async findById(
    workspaceId: number,
    manager?: EntityManager,
  ): Promise<Workspace> {
    if (manager) {
      return manager.findOne(Workspace, { where: { id: workspaceId } });
    }

    return this.workspaceRepository.findOne({ where: { id: workspaceId } });
  }

  async findByUserId(userId: number): Promise<Array<WorkspaceUser>> {
    return this.workspaceUserRepository.find({
      where: { user: { id: userId } },
      relations: ['workspace'],
    });
  }

  async addFolderToWorkspaceOrder(
    workspaceId: number,
    folderId: number,
    manager: EntityManager,
  ): Promise<void> {
    const workspace = await manager.findOne(Workspace, {
      where: { id: workspaceId },
    });
    if (!workspace.folderOrder.includes(folderId)) {
      workspace.folderOrder.push(folderId);
      await manager.save(workspace);
    }
  }

  async removeFolderFromWorkspaceOrder(
    workspaceId: number,
    folderId: number,
    manager: EntityManager,
  ): Promise<void> {
    const workspace = await manager.findOne(Workspace, {
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ${workspaceId} not found`);
    }

    workspace.folderOrder = workspace.folderOrder.filter(
      (id) => id !== folderId,
    );

    await manager.save(workspace);
  }

  async changeFolderOrder(
    workspaceId: number,
    folderId: number,
    order: number,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace with ${workspaceId} not found`);
    }
    const originOrder = workspace.folderOrder.indexOf(folderId);
    workspace.folderOrder.splice(originOrder, 1);
    workspace.folderOrder.splice(order, 0, folderId);
    await this.workspaceRepository.save(workspace);
  }
}
