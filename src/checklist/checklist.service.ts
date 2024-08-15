import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Checklist } from './checklist.entity';
import { Folder } from '../folder/folder.entity';
import { FolderService } from '../folder/folder.service';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
    private readonly folderService: FolderService,
  ) {}

  async findByFolderId(folderId: number) {
    return this.checklistRepository.find({
      where: { folder: { id: folderId } },
    });
  }

  async createChecklist(
    title: string,
    folder: Folder,
    permissionCode: string,
    manager?: EntityManager,
  ) {
    const checklist = new Checklist();
    checklist.title = title;
    checklist.folder = folder;
    checklist.permission_code = permissionCode;
    if (manager) {
      await manager.save(checklist);

      await this.folderService.addChecklistToFolderOrder(
        folder.id,
        checklist.id,
        manager,
      );
      return checklist;
    }

    await this.checklistRepository.save(checklist);

    return checklist;
  }

  async addChecklistItemToChecklistOrder(
    checklistId: number,
    checklistItemId: number,
    manager: EntityManager,
  ) {
    const checklist = await manager.findOne(Checklist, {
      where: { id: checklistId },
    });

    checklist.item_order.push(checklistItemId);

    await manager.save(checklist);
  }

  async updateChecklistItemOrder(
    checklistId: number,
    checklistItemIds: Array<number>,
    manager: EntityManager,
  ) {
    const checklist = await manager.findOne(Checklist, {
      where: { id: checklistId },
    });

    checklist.item_order = checklistItemIds;
    await manager.save(checklist);
  }
}
