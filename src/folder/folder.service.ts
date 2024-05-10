import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {}

  async createFolder(folderName: string, isDefault?: boolean) {
    const folder = new Folder();
    folder.name = folderName;
    folder.is_default = isDefault ?? false;
    const newFolder = await this.folderRepository.save(folder);
    return newFolder.id;
  }
}
