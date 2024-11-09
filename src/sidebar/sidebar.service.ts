import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { WorkspaceUser } from '../workspace/entities/workspace-user.entity';
import { GetSidebarDto } from './dtos/get-sidebar.dto';
import { GetWorkspaceDto } from './dtos/get-workspace.dto';
import { GetDefaultFolderDto } from './dtos/get-default-folder.dto';
import { GetFolderDto } from './dtos/get-folder.dto';
import { GetChecklistDto } from './dtos/get-checklist.dto';

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
        const { id, name } = workspaceUser.workspace;
        const [defaultFolder, folders] = await Promise.all([
          this.findDefaultFolder(id),
          this.findFolderList(id),
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
    const sortedChecklists = this.sortChecklistsByOrder(
      checklistOrder,
      checklists,
    );

    return {
      id,
      checklists: sortedChecklists,
    };
  }

  async findFolderList(workspaceId: number): Promise<Array<GetFolderDto>> {
    const folders =
      await this.folderService.findByWorkspaceIdWithChecklist(workspaceId);

    const sortedFoldersChecklists = folders.map((folder) => {
      const { id, name, checklist_order: checklistOrder, checklists } = folder;
      const sortedChecklists = this.sortChecklistsByOrder(
        checklistOrder,
        checklists,
      );

      return {
        id,
        name,
        checklists: sortedChecklists,
      };
    });
    return sortedFoldersChecklists;
  }

  private sortChecklistsByOrder(
    checklistOrder: Array<number>,
    checklists: Array<GetChecklistDto>,
  ): Array<GetChecklistDto> {
    const checklistMap = new Map(
      checklists.map((checklist) => [checklist.id, checklist]),
    );

    return checklistOrder
      .map((checklistId) => checklistMap.get(checklistId))
      .filter((checklist) => checklist !== undefined);
  }
}
