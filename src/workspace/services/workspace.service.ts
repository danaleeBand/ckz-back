import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceUser } from '../entities/workspace-user.entity';
import { PermissionService } from '../../permission/permission.service';
import { CreateWorkspaceDto } from '../dtos/create-workspace.dto';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { WorkspaceUserService } from './workspace_user.service';
import { UpdateWorkspaceDto } from '../dtos/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository2: Repository<Workspace>,
    private workspaceRepository: WorkspaceRepository,
    @InjectRepository(WorkspaceUser)
    private readonly workspaceUserRepository: Repository<WorkspaceUser>,
    private readonly workspaceUserService: WorkspaceUserService,
    private dataSource: DataSource,
    private readonly permissionService: PermissionService,
  ) {}

  async getWorkspaces(userId: number): Promise<Array<Workspace>> {
    return this.workspaceRepository2.find({
      where: { workspaceUsers: { user: { id: userId } } },
    });
  }

  async getWorkspace(workspaceId: number): Promise<Workspace> {
    return this.workspaceRepository2.findOne({
      where: { id: workspaceId },
    });
  }

  async createWorkspaceWithPermission(
    userId: number,
    dto: CreateWorkspaceDto,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const permissionCode = await this.permissionService.createPermission(
        userId,
        manager,
      );

      const workspace = await this.workspaceRepository.createWorkspace(
        dto.name,
        permissionCode,
        manager,
      );

      await this.workspaceUserService.createWorkspaceUser(
        workspace.id,
        userId,
        manager,
      );
    });
  }

  async createWorkspace(
    name: string,
    permissionCode: string,
    manager: EntityManager,
  ) {
    const workspace = new Workspace();
    workspace.name = name;
    workspace.permissionCode = permissionCode;
    if (manager) {
      return manager.save(workspace);
    }
    return this.workspaceRepository2.save(workspace);
  }

  async findById(
    workspaceId: number,
    manager?: EntityManager,
  ): Promise<Workspace> {
    if (manager) {
      return manager.findOne(Workspace, { where: { id: workspaceId } });
    }

    return this.workspaceRepository2.findOne({ where: { id: workspaceId } });
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
    const workspace = await this.workspaceRepository2.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace with ${workspaceId} not found`);
    }
    const originOrder = workspace.folderOrder.indexOf(folderId);
    workspace.folderOrder.splice(originOrder, 1);
    workspace.folderOrder.splice(order, 0, folderId);
    await this.workspaceRepository2.save(workspace);
  }

  async updateWorkspace(id: number, dto: UpdateWorkspaceDto): Promise<void> {
    await this.workspaceRepository.updateWorkspace(id, dto);
  }
}
