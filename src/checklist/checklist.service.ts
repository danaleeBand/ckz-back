import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Checklist } from './checklist.entity';
import { FolderService } from '../folder/folder.service';
import { UpdateChecklistDto } from './dtos/update-checklist.dto';
import { Folder } from '../folder/folder.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
    private dataSource: DataSource,
  ) {}

  async findByFolderId(folderId: number) {
    return this.checklistRepository.find({
      where: { folder: { id: folderId } },
    });
  }

  async createChecklist(
    folderId: number,
    title: string,
    manager?: EntityManager,
  ): Promise<Checklist> {
    const executeInTransaction = async (transactionManager: EntityManager) => {
      const folder = await this.folderService.findById(
        folderId,
        transactionManager,
      );

      const checklist = new Checklist();
      checklist.title = title;
      checklist.folder = folder;
      checklist.permission_code = folder.permission_code;

      await transactionManager.save(checklist);

      await this.folderService.addChecklistToFolderOrder(
        folder.id,
        checklist.id,
        transactionManager,
      );

      return checklist;
    };

    if (manager) {
      return executeInTransaction(manager);
    }
    return this.dataSource.transaction(executeInTransaction);
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

  async updateChecklistsFolderId(
    checklistIds: Array<number>,
    folder: Folder,
    manager: EntityManager,
  ) {
    await manager.update(Checklist, { id: In(checklistIds) }, { folder });
  }

  async updateChecklist(
    checklistId: number,
    updateChecklistDto: UpdateChecklistDto,
  ): Promise<Checklist> {
    const { title } = updateChecklistDto;
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });
    checklist.title = title;

    return this.checklistRepository.save(checklist);
  }

  async deleteChecklist(checklistId: number): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const checklist = await manager.findOne(Checklist, {
        where: { id: checklistId },
        relations: ['folder'],
      });

      if (!checklist) {
        throw new NotFoundException(
          `Checklist with ID ${checklistId} not found`,
        );
      }

      await this.folderService.removeChecklistToFolderOrder(
        checklist.folder.id,
        checklist.id,
        manager,
      );

      await manager.remove(Checklist, checklist);
    });
  }

  async findByChecklistId(
    checklistId: number,
    manager?: EntityManager,
  ): Promise<Checklist> {
    if (manager) {
      return manager.findOne(Checklist, {
        where: { id: checklistId },
      });
    }
    return this.checklistRepository.findOne({
      where: { id: checklistId },
    });
  }

  async removeChecklistItemToChecklistOrder(
    checklistId: number,
    checklistItemId: number,
    manager: EntityManager,
  ): Promise<void> {
    const checklist = await manager.findOne(Checklist, {
      where: { id: checklistId },
    });

    if (!checklist) {
      throw new NotFoundException(`Checklist with ID ${checklistId} not found`);
    }

    const index = checklist.item_order.indexOf(checklistItemId);
    if (index > -1) {
      checklist.item_order.splice(index, 1);
      await manager.save(checklist);
    } else {
      throw new NotFoundException(
        `ChecklistItem with ID ${checklistItemId} not found in checklist`,
      );
    }
  }
}
