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

  async createFolder(workspaceId: number, name: string, isDefault?: boolean) {
    const folder = new Folder();
    folder.workspace_id = workspaceId;
    folder.name = name;
    folder.is_default = isDefault ?? false;
    const newFolder = await this.folderRepository.save(folder);
    return newFolder.id;
  }
}
