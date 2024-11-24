import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { WorkspaceUser } from '../workspace/entities/workspace-user.entity';
import { GetSidebarDto } from './dtos/get-sidebar.dto';
import { GetWorkspaceDto } from './dtos/get-workspace.dto';
import { GetDefaultFolderDto } from './dtos/get-default-folder.dto';
import { GetFolderDto } from './dtos/get-folder.dto';

@Injectable()
export class SidebarService {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly folderService: FolderService,
  ) {}

  async getSidebarTree(userId: number): Promise<GetSidebarDto> {
    const workspaces = await this.findWorkspaces(userId);
    return { workspaces };
  }

  async findWorkspaces(userId: number): Promise<Array<GetWorkspaceDto>> {
    const userWorkspaces = await this.workspaceService.findByUserId(userId);
    const workspaces = await Promise.all(
      userWorkspaces.map(async (workspaceUser: WorkspaceUser) => {
        const { id, name, folder_order: folderOrder } = workspaceUser.workspace;
        const [defaultFolder, folders] = await Promise.all([
          this.findDefaultFolder(id),
          this.findFolderList(id, folderOrder),
        ]);

        return {
          id,
          name,
          defaultFolder,
          folders,
        };
      }),
    );
    return workspaces;
  }

  async findDefaultFolder(workspaceId: number): Promise<GetDefaultFolderDto> {
    const defaultFolder =
      await this.folderService.findDefaultFolderByWorkspaceIdWithChecklist(
        workspaceId,
      );

    const { id, checklist_order: checklistOrder, checklists } = defaultFolder;
    const sortedChecklists = this.sortItemsByOrder(
      checklistOrder,
      new Map(checklists.map((checklist) => [checklist.id, checklist])),
    );

    return {
      id,
      checklists: sortedChecklists,
    };
  }

  async findFolderList(
    workspaceId: number,
    folderOrder: Array<number>,
  ): Promise<Array<GetFolderDto>> {
    const folders =
      await this.folderService.findByWorkspaceIdWithChecklist(workspaceId);
    const folderMap = new Map(folders.map((folder) => [folder.id, folder]));
    const sortedFolders = this.sortItemsByOrder(folderOrder, folderMap);

    const sortedFoldersChecklists = sortedFolders.map((folder) => {
      const { id, name, checklist_order: checklistOrder, checklists } = folder;
      const sortedChecklists = this.sortItemsByOrder(
        checklistOrder,
        new Map(checklists.map((checklist) => [checklist.id, checklist])),
      );

      return {
        id,
        name,
        checklists: sortedChecklists,
      };
    });

    return sortedFoldersChecklists;
  }

  private sortItemsByOrder<T>(
    order: Array<number>,
    itemMap: Map<number, T>,
  ): Array<T> {
    return order
      .map((itemId) => itemMap.get(itemId))
      .filter((item) => item !== undefined);
  }
}
