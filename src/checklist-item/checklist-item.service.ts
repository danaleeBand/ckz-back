import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistService } from '../checklist/checklist.service';
import { UpdateChecklistItemDto } from './dtos/update-checklist-item.dto';
import { User } from '../user/user.entity';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
    @Inject(forwardRef(() => ChecklistService))
    private readonly checklistService: ChecklistService,
    private dataSource: DataSource,
  ) {}

  async createChecklistItem(
    user: User,
    checklistId: number,
    title: string,
    memo: string,
    emoji: string,
    manager?: EntityManager,
  ): Promise<ChecklistItem> {
    const executeInTransaction = async (transactionManager: EntityManager) => {
      const checklist = await this.checklistService.findByChecklistId(
        checklistId,
        transactionManager,
      );

      const checklistItem = await this.checklistItemRepository.create({
        title,
        memo,
        emoji,
        permissionCode: checklist.permissionCode,
        createdBy: { id: user.id },
        updatedBy: { id: user.id },
      });

      await transactionManager.save(checklistItem);

      await this.checklistService.addChecklistItemToChecklistOrder(
        checklist.id,
        checklistItem.id,
        transactionManager,
      );
      return checklistItem;
    };

    if (manager) {
      return executeInTransaction(manager);
    }
    return this.dataSource.transaction(executeInTransaction);
  }

  async getChecklistItems(checklistId: number) {
    const { itemOrder } =
      await this.checklistService.findByChecklistId(checklistId);

    if (itemOrder.length === 0) {
      return [];
    }

    const checklistItems = await this.checklistItemRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids: itemOrder })
      .orderBy(
        `array_position(array[${itemOrder.join(', ')}]::int[], item.id::int)`,
      )
      .getMany();

    return checklistItems;
  }

  async getChecklistItemById(id: number): Promise<ChecklistItem> {
    return this.checklistItemRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async updateChecklistItem(
    user: User,
    checklistItemId: number,
    updateChecklistItemDto: UpdateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const checklistItem = await this.checklistItemRepository.findOne({
      where: { id: checklistItemId },
    });

    Object.assign(checklistItem, {
      ...updateChecklistItemDto,
      updated_by: { id: user.id },
    });

    return this.checklistItemRepository.save(checklistItem);
  }

  async deleteChecklistItem(checklistItemId: number): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const checklistItem = await manager.findOne(ChecklistItem, {
        where: { id: checklistItemId },
        relations: ['checklist'],
      });

      if (!checklistItem) {
        throw new NotFoundException(
          `ChecklistItem with ID ${checklistItemId} not found`,
        );
      }

      await this.checklistService.removeChecklistItemToChecklistOrder(
        checklistItem.checklist.id,
        checklistItem.id,
        manager,
      );

      await manager.remove(ChecklistItem, checklistItem);
    });
  }
}
