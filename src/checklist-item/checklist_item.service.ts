import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistItem } from '../checklist-item.entity';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private checklistItemRepository: Repository<ChecklistItem>,
  ) {}

  async createChecklistItem(title: string, checklistId: number) {
    const checklistItem = new ChecklistItem();
    checklistItem.title = title;
    checklistItem.checklist_id = checklistId;
    const newChecklistItem =
      await this.checklistItemRepository.save(checklistItem);
    return newChecklistItem.id;
  }
}
