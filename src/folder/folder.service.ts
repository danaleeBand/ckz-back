import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './folder.entity';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async findById(folderId: number) {
    return this.folderRepository.findOne({
      where: { id: folderId },
      select: ['id', 'name'],
    });
  }

  async findByWorkspaceId(workspaceId: number) {
    const workspace = await this.workspaceService.findById(workspaceId);
    return this.folderRepository.find({
      where: { workspace },
    });
  }

  async createFolder(workspaceId: number, name: string, isDefault?: boolean) {
    const folder = new Folder();
    folder.workspace_id = workspaceId;
    folder.name = name;
    folder.is_default = isDefault ?? false;
    const newFolder = await this.folderRepository.save(folder);
    return newFolder.id;
  }
}
