import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checklist } from './checklist.entity';
import { Folder } from '../folder/folder.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
  ) {}

  async findByFolderId(folderId: number) {
    return this.checklistRepository.find({
      where: { folder: { id: folderId } },
    });
  }

  async createChecklist(title: string, folder: Folder) {
    const checklist = new Checklist();
    checklist.title = title;
    checklist.folder = folder;
    const newChecklist = await this.checklistRepository.save(checklist);
    return newChecklist;
  }
}
