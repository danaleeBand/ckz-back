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
import { ChangeChecklistOrderDto } from './dtos/change-checklist-order.dto';
import { ChecklistItemService } from '../checklist-item/checklist-item.service';
import { User } from '../user/user.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
    private dataSource: DataSource,
    @Inject(forwardRef(() => ChecklistItemService))
    private readonly checklistItemService: ChecklistItemService,
  ) {}

  async getChecklist(checklistId: number): Promise<Checklist> {
    return this.checklistRepository.findOne({
      where: { id: checklistId },
      relations: {
        folder: {
          workspace: true,
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async getChecklistDetail(checklistId: number) {
    const checklist = await this.getChecklist(checklistId);
    const checklistItems =
      await this.checklistItemService.getChecklistItems(checklistId);
    const { folder, ...checklistData } = checklist;
    const { workspace, ...folderData } = folder;

    return {
      checklist: checklistData,
      folder: folderData,
      workspace,
      items: checklistItems,
    };
  }

  async createChecklist(
    user: User,
    folderId: number,
    title: string,
    emoji: string,
    manager?: EntityManager,
  ): Promise<Checklist> {
    const executeInTransaction = async (transactionManager: EntityManager) => {
      const folder = await this.folderService.findById(
        folderId,
        transactionManager,
      );

      const checklist = await this.checklistRepository.create({
        title,
        emoji,
        folder,
        permissionCode: folder.permissionCode,
        createdBy: { id: user.id },
        updatedBy: { id: user.id },
      });

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

    checklist.itemOrder.push(checklistItemId);

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

    checklist.itemOrder = checklistItemIds;
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
    user: User,
    checklistId: number,
    updateChecklistDto: UpdateChecklistDto,
  ): Promise<Checklist> {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });

    Object.assign(checklist, {
      ...updateChecklistDto,
      updated_by: { id: user.id },
    });

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

    checklist.itemOrder = checklist.itemOrder.filter(
      (id) => id !== checklistItemId,
    );

    await manager.save(checklist);
  }

  async changeChecklistOrder(
    checklistId: number,
    dto: ChangeChecklistOrderDto,
  ): Promise<void> {
    const { folderId, order } = dto;
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
      relations: ['folder'],
    });

    const currentFolderId = checklist.folder.id;
    await this.folderService.changeChecklistOrder(
      currentFolderId,
      folderId,
      checklistId,
      order,
    );
  }
}
