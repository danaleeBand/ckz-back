import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { Checklist } from '../checklist/checklist.entity';
import { ChecklistService } from '../checklist/checklist.service';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
    private readonly checklistService: ChecklistService,
  ) {}

  async createChecklistItem(
    title: string,
    checklist: Checklist,
    permissionCode: string,
    manager?: EntityManager,
  ) {
    const checklistItem = new ChecklistItem();
    checklistItem.title = title;
    checklistItem.checklist = checklist;
    checklistItem.permission_code = permissionCode;
    if (manager) {
      await manager.save(checklistItem);

      await this.checklistService.addChecklistItemToChecklistOrder(
        checklist.id,
        checklistItem.id,
        manager,
      );
      return checklistItem;
    }

    await this.checklistItemRepository.save(checklistItem);

    return checklistItem;
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
}
