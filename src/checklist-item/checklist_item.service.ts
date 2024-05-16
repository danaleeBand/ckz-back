import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { Checklist } from '../checklist/checklist.entity';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private checklistItemRepository: Repository<ChecklistItem>,
  ) {}

  async createChecklistItem(title: string, checklist: Checklist) {
    const checklistItem = new ChecklistItem();
    checklistItem.title = title;
    checklistItem.checklist = checklist;
    const newChecklistItem =
      await this.checklistItemRepository.save(checklistItem);
    return newChecklistItem.id;
  }
}
