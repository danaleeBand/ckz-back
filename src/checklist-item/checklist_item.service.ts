import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ChecklistItem } from './checklist_item.entity';
import { Checklist } from '../checklist/checklist.entity';
import {ChecklistService} from "../checklist/checklist.service";

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
    manager?: EntityManager,
  ) {
    const checklistItem = new ChecklistItem();
    checklistItem.title = title;
    checklistItem.checklist = checklist;
    if (manager) {
      await manager.save(checklistItem);
    }
    await this.checklistItemRepository.save(checklistItem);

    await this.checklistService.addChecklistItemToChecklistOrder(
      checklist.id,
      checklistItem.id,
    );

    return checklistItem;
  }
}
