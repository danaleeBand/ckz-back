import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistService } from '../checklist/checklist.service';
import { UpdateChecklistItemDto } from './dtos/update-checklist-item.dto';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
    private readonly checklistService: ChecklistService,
    private dataSource: DataSource,
  ) {}

  async createChecklistItem(
    checklistId: number,
    title: string,
    manager?: EntityManager,
  ): Promise<ChecklistItem> {
    const executeInTransaction = async (transactionManager: EntityManager) => {
      const checklist = await this.checklistService.findByChecklistId(
        checklistId,
        transactionManager,
      );

      const checklistItem = new ChecklistItem();
      checklistItem.title = title;
      checklistItem.checklist = checklist;
      checklistItem.permission_code = checklist.permission_code;

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
    const { item_order: itemOrder } =
      await this.checklistService.findByChecklistId(checklistId);

    if (itemOrder.length === 0) {
      return [];
    }

    const checklistItems = await this.checklistItemRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids: itemOrder })
      .select([
        'item.id',
        'item.title',
        'item.memo',
        'item.image_url',
        'item.is_checked',
        'item.checked_at',
        'item.created_at',
        'item.updated_at',
      ])
      .orderBy(
        `array_position(array[${itemOrder.join(', ')}]::int[], item.id::int)`,
      )
      .getMany();

    return checklistItems;
  }

  async updateChecklistItem(
    checklistItemId: number,
    updateChecklistItemDto: UpdateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const { title, memo, imageUrl, isChecked } = updateChecklistItemDto;
    const checklistItem = await this.checklistItemRepository.findOne({
      where: { id: checklistItemId },
    });

    checklistItem.title = title;
    checklistItem.memo = memo;
    checklistItem.image_url = imageUrl;
    checklistItem.is_checked = isChecked;

    return this.checklistItemRepository.save(checklistItem);
  }
}
