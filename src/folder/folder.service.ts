import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Folder } from './folder.entity';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { UpdateFolderDto } from './dtos/update-folder.dto';

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
    workspaceId: number,
    name: string,
    isDefault?: boolean,
    manager?: EntityManager,
  ) {
    const workspace = await this.workspaceService.findById(workspaceId);

    const folder = new Folder();
    folder.workspace = workspace;
    folder.name = name;
    folder.is_default = isDefault ?? false;
    folder.permission_code = workspace.permission_code;
    if (manager) {
      await manager.save(folder);

      await this.workspaceService.addFolderToWorkspaceOrder(
        workspace.id,
        folder.id,
        manager,
      );
      return folder;
    }

    await this.folderRepository.save(folder);

    return folder;
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

  async updateFolder(folderId: number, dto: UpdateFolderDto) {
    const { name } = dto;
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });
    folder.name = name;

    return this.folderRepository.save(folder);
  }
}
