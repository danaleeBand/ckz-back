import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Folder } from './folder.entity';
import { Workspace } from '../workspace/entities/workspace.entity';

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

  async createFolder(
    workspace: Workspace,
    name: string,
    isDefault?: boolean,
    manager?: EntityManager,
  ) {
    const folder = new Folder();
    folder.workspace = workspace;
    folder.name = name;
    folder.is_default = isDefault ?? false;
    if (manager) {
      return manager.save(folder);
    }
    return this.folderRepository.save(folder);
  }
}
