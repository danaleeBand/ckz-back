import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Folder } from './folder.entity';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { ChecklistService } from '../checklist/checklist.service';
import { ChangeFolderOrderDto } from './dtos/change-folder-order.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => ChecklistService))
    private readonly checklistService: ChecklistService,
    private dataSource: DataSource,
  ) {}

  async findById(folderId: number, manager?: EntityManager): Promise<Folder> {
    if (manager) {
      return manager.findOne(Folder, { where: { id: folderId } });
    }
    return this.folderRepository.findOne({
      where: { id: folderId },
    });
  }

  async findByWorkspaceId(workspaceId: number): Promise<Array<Folder>> {
    return this.folderRepository.find({
      where: { workspace: { id: workspaceId } },
    });
  }

  async findDefaultFolderByWorkspaceIdWithChecklist(
    workspaceId: number,
  ): Promise<Folder> {
    return this.folderRepository.findOne({
      where: { workspace: { id: workspaceId }, is_default: true },
      relations: ['checklists'],
      select: {
        id: true,
        checklist_order: true,
        checklists: {
          id: true,
          title: true,
        },
      },
    });
  }

  async findByWorkspaceIdWithChecklist(
    workspaceId: number,
  ): Promise<Array<Folder>> {
    return this.folderRepository.find({
      where: { workspace: { id: workspaceId }, is_default: false },
      relations: ['checklists'],
      select: {
        id: true,
        name: true,
        checklist_order: true,
        checklists: {
          id: true,
          title: true,
        },
      },
    });
  }

  async findByWorkspaceIdDefault(
    workspaceId: number,
    manager?: EntityManager,
  ): Promise<Folder> {
    if (manager) {
      return manager.findOne(Folder, {
        where: { workspace: { id: workspaceId }, is_default: true },
      });
    }

    return this.folderRepository.findOne({
      where: { workspace: { id: workspaceId }, is_default: true },
    });
  }

  async createFolder(
    workspaceId: number,
    name: string,
    isDefault: boolean,
    manager: EntityManager,
  ): Promise<Folder> {
    const workspace = await this.workspaceService.findById(
      workspaceId,
      manager,
    );

    const folder = new Folder();
    folder.workspace = workspace;
    folder.name = name;
    folder.is_default = isDefault;
    folder.permission_code = workspace.permission_code;
    await manager.save(folder);

    return folder;
  }

  async createFolderInWorkspace(
    workspaceId: number,
    name: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const folder = await this.createFolder(workspaceId, name, false, manager);

      await this.workspaceService.addFolderToWorkspaceOrder(
        workspaceId,
        folder.id,
        manager,
      );
    });
  }

  async addChecklistToFolderOrder(
    folderId: number,
    checklistId: number,
    manager: EntityManager,
  ) {
    const folder = await manager.findOne(Folder, {
      where: { id: folderId },
    });

    if (!folder.checklist_order.includes(checklistId)) {
      folder.checklist_order.push(checklistId);
      await manager.save(folder);
    }
  }

  async addChecklistsToFolderOrder(
    folderId: number,
    checklistIds: Array<number>,
    manager: EntityManager,
  ) {
    const folder = await manager.findOne(Folder, {
      where: { id: folderId },
    });

    const newChecklistIds = checklistIds.filter(
      (checklistId) => !folder.checklist_order.includes(checklistId),
    );

    if (newChecklistIds.length > 0) {
      folder.checklist_order.push(...newChecklistIds);
      await manager.save(folder);
    }
  }

  async removeChecklistToFolderOrder(
    folderId: number,
    checklistId: number,
    manager: EntityManager,
  ): Promise<void> {
    const folder = await manager.findOne(Folder, {
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    folder.checklist_order = folder.checklist_order.filter(
      (id) => id !== checklistId,
    );

    await manager.save(folder);
  }

  async updateFolder(folderId: number, dto: UpdateFolderDto): Promise<Folder> {
    const { name } = dto;
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });
    folder.name = name;

    return this.folderRepository.save(folder);
  }

  async deleteFolder(folderId: number): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const folder = await manager.findOne(Folder, {
        where: { id: folderId },
        relations: ['workspace', 'checklists'],
      });

      if (!folder) {
        throw new NotFoundException(`Folder with ID ${folderId} not found`);
      }

      await this.workspaceService.removeFolderFromWorkspaceOrder(
        folder.workspace.id,
        folder.id,
        manager,
      );

      if (folder.checklists.length > 0) {
        const defaultFolder = await this.findByWorkspaceIdDefault(
          folder.workspace.id,
          manager,
        );

        await this.checklistService.updateChecklistsFolderId(
          folder.checklist_order,
          defaultFolder,
          manager,
        );

        await this.addChecklistsToFolderOrder(
          defaultFolder.id,
          folder.checklist_order,
          manager,
        );
      }

      await manager.remove(Folder, folder);
    });
  }

  async changeFolderOrder(
    folderId: number,
    dto: ChangeFolderOrderDto,
  ): Promise<void> {
    const { order } = dto;
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['workspace'],
    });

    await this.workspaceService.changeFolderOrder(
      folder.workspace.id,
      folder.id,
      order,
    );
  }

  async changeChecklistOrder(
    currentFolderId: number,
    folderId: number,
    checklistId: number,
    order: number,
  ): Promise<void> {
    const currentFolder = await this.findById(currentFolderId);
    const originOrder = currentFolder.checklist_order.indexOf(checklistId);
    const targetFolder =
      currentFolderId === folderId
        ? currentFolder
        : await this.findById(folderId);

    currentFolder.checklist_order.splice(originOrder, 1);
    targetFolder.checklist_order.splice(order, 0, checklistId);

    await this.folderRepository.save(currentFolder);
    await this.folderRepository.save(targetFolder);
  }
}
