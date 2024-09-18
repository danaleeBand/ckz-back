import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { ChecklistService } from '../checklist/checklist.service';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { WorkspaceUser } from '../workspace/entities/workspace-user.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import { Folder } from '../folder/folder.entity';

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
    const workspaces = await Promise.all(
      userWorkspaces.map(async (item: WorkspaceUser) => ({
        id: item.workspace.id,
        name: item.workspace.name,
        defaultFolder: await this.findDefaultFolder(item.workspace.id),
        folder: await this.findFolderList(item.workspace),
      })),
    );
    return workspaces;
  }

  async findDefaultFolder(workspaceId: number) {
    const folderList = await this.folderService.findByWorkspaceId(workspaceId);
    const defaultFolder = folderList.find((folder) => folder.isDefault());
    return {
      id: defaultFolder.id,
      checklist: await this.findCheckLists(defaultFolder),
    };
  }

  async findFolderList(workspace: Workspace) {
    const folders = await this.folderService.findByWorkspaceId(workspace.id);

    const sortedFolders = workspace.folder_order
      .map((folderId) => folders.find((folder) => folder.id === folderId))
      .filter((folder) => folder && !folder.isDefault());

    const folderList = sortedFolders.map(async (folder) => ({
      id: folder.id,
      name: folder.name,
      checklist: await this.findCheckLists(folder),
    }));

    return Promise.all(folderList);
  }

  async findCheckLists(folder: Folder) {
    const checklists = await this.checklistService.findByFolderId(folder.id);
    const sortedChecklists = folder.checklist_order.map((checklistId) =>
      checklists.find((checklist) => checklist.id === checklistId),
    );
    return sortedChecklists.map((checklist) => ({
      id: checklist.id,
      title: checklist.title,
    }));
  }
}
