import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checklist } from './checklist.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
  ) {}

  async createChecklist(title: string, folderId: number) {
    const checklist = new Checklist();
    checklist.title = title;
    checklist.folder_id = folderId;
    const newChecklist = await this.checklistRepository.save(checklist);
    return newChecklist.id;
  }
}
