import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Folder } from './folder.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import {WorkspaceService} from "../workspace/services/workspace.service";

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async findById(folderId: number) {
    return this.folderRepository.findOne({
      where: { id: folderId },
      select: ['id', 'name'],
    });
  }

  async findByWorkspaceId(workspaceId: number) {
    return this.folderRepository.find({
      where: { workspace: { id: workspaceId } },
    });
  }

  async createFolder(
    workspace: Workspace,
    name: string,
    isDefault?: boolean,
    manager?: EntityManager,
  ) {
    const folder = new Folder();
    folder.workspace = workspace;
    folder.name = name;
    folder.is_default = isDefault ?? false;
    if (manager) {
      await manager.save(folder);
    }
    await this.folderRepository.save(folder);

    await this.workspaceService.addFolderToWorkspaceOrder(
      workspace.id,
      folder.id,
    );

    return folder;
  }

  async addChecklistToFolderOrder(
    folderId: number,
    checklistId: number,
    manager?: EntityManager,
  ) {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (!folder.checklist_order) {
      folder.checklist_order = [];
    }

    if (!folder.checklist_order.includes(checklistId)) {
      folder.checklist_order.push(checklistId);

      if (manager) {
        await manager.save(folder);
      }

      await this.folderRepository.save(folder);
    }
  }
}
