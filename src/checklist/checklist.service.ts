import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checklist } from './checklist.entity';
import { FolderService } from '../folder/folder.service';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
    private readonly folderService: FolderService,
  ) {}

  async findByFolderId(folderId: number) {
    const folder = await this.folderService.findById(folderId);
    return this.checklistRepository.find({
      where: { folder },
    });
  }
}
