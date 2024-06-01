import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { Checklist } from '../checklist/checklist.entity';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private checklistItemRepository: Repository<ChecklistItem>,
  ) {}

  async createChecklistItem(
    title: string,
    checklist: Checklist,
    manager?: EntityManager,
  ) {
    const checklistItem = new ChecklistItem();
    checklistItem.title = title;
    checklistItem.checklist = checklist;
    if (manager) {
      return manager.save(checklistItem);
    }
    return this.checklistItemRepository.save(checklistItem);
  }
}
