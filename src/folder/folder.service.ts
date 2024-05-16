import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async findById(folderId: number) {
    return this.folderRepository.findOne({
      where: { id: folderId },
      select: ['id', 'name'],
    });
  }

  async findByWorkspaceId(workspaceId: number) {
    return this.folderRepository.find({
      where: { workspace: { id: workspaceId } },
    });
  }

  async createFolder(workspace, name: string, isDefault?: boolean) {
    const folder = new Folder();
    folder.workspace = workspace;
    folder.name = name;
    folder.is_default = isDefault ?? false;
    const newFolder = await this.folderRepository.save(folder);
    return newFolder;
  }
}
