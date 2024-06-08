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
    manager?: EntityManager,
  ) {
    const checklist = new Checklist();
    checklist.title = title;
    checklist.folder = folder;
    if (manager) {
      await manager.save(checklist);
    }

    await this.checklistRepository.save(checklist);

    await this.folderService.addChecklistToFolderOrder(folder.id, checklist.id);

    return checklist;
  }

  async addChecklistItemToChecklistOrder(
    checklistId: number,
    checklistItemId: number,
    manager?: EntityManager,
  ) {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });

    if (!checklist.item_order) {
      checklist.item_order = [];
    }

    if (!checklist.item_order.includes(checklistItemId)) {
      checklist.item_order.push(checklistItemId);

      if (manager) {
        await manager.save(checklist);
      }

      await this.checklistRepository.save(checklist);
    }
  }
}
