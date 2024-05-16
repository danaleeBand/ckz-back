import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { ChecklistService } from '../checklist/checklist.service';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { WorkspaceUser } from '../workspace/entities/workspace-user.entity';

@Injectable()
export class SidebarService {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly folderService: FolderService,
    private readonly checklistService: ChecklistService,
  ) {}

  async findSidebarTree(userId: number) {
    const workspaces = await this.findWorkspaces(userId);
    return { workspace: workspaces };
  }

  async findWorkspaces(userId: number) {
    const userWorkspaces = await this.workspaceService.findByUserId(userId);
    const folders = userWorkspaces.map(async (item: WorkspaceUser) => ({
      id: item.workspace.id,
      name: item.workspace.name,
      defaultFolder: [
        { id: 1, title: '임시1' },
        { id: 2, title: '임시2' },
      ],
      folder: await Promise.all(
        item.workspace.folder_order.map(async (folderId) =>
          this.findFolder(folderId),
        ),
      ),
    }));
    return Promise.all(folders);
  }

  async findFolder(folderId: number) {
    const folder = await this.folderService.findById(folderId);
    return {
      id: folder.id,
      name: folder.name,
      checklist: await this.findCheckLists(folder.id),
    };
  }

  async findCheckLists(folderId: number) {
    const checklists = await this.checklistService.findByFolderId(folderId);
    return checklists.map((checklist) => ({
      id: checklist.id,
      title: checklist.title,
    }));
  }
}
