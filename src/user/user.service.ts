import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { FolderService } from '../folder/folder.service';
import { ChecklistItemService } from '../checklist-item/checklist-item.service';
import { WorkspaceUserService } from '../workspace/services/workspace_user.service';
import { ChecklistService } from '../checklist/checklist.service';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private workspaceService: WorkspaceService,
    private folderService: FolderService,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    private workspaceUserService: WorkspaceUserService,
    private dataSource: DataSource,
    private permissionService: PermissionService,
  ) {}

  async createUser(userName, manager?: EntityManager) {
    const user = new User();
    user.name = userName;
    if (manager) {
      return manager.save(user);
    }
    return this.userRepository.save(user);
  }

  async findOneUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(userId: number, dto: UpdateUserDto): Promise<void> {
    await this.findOneUser(userId);
    const user = await this.findOneUser(userId);

    if (!user.isChecky) {
      await this.createSampleData(user);
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);
  }

  async createSampleData(user: User) {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const permissionCode = await this.permissionService.createPermission(
        user.id,
        manager,
      );

      const workspace = await this.workspaceService.createWorkspace(
        '기본 워크스페이스',
        permissionCode,
        manager,
      );
      await this.workspaceUserService.createWorkspaceUser(
        workspace.id,
        user.id,
        manager,
      );
      const folder = await this.folderService.createFolder(
        workspace.id,
        '기본 폴더',
        true,
        manager,
      );
      const checklist = await this.checklistService.createChecklist(
        user,
        folder.id,
        '기본 체크리스트',
        '',
        manager,
      );
      const checklistItemList = [
        { title: '체키가 되기 🎉', memo: '체키가 되어보자!' },
        {
          title: '친구들과 워크스페이스 생성하기 ✅',
          memo: '함께할 친구들과 멋진 공간을 만들어보자!',
        },
        {
          title: '체크리스트 작성하기 👯',
          memo: '해야 할 일들을 정리하고, 하나씩 달성해보자!',
        },
      ];
      const checklistItemOrder = [];
      const promises = checklistItemList.map(async ({ title, memo }) => {
        const checklistItem = this.checklistItemService.createChecklistItem(
          user,
          checklist.id,
          title,
          memo,
          '',
          manager,
        );
        checklistItemOrder.push((await checklistItem).id);
      });
      await Promise.all(promises);

      await this.checklistService.updateChecklistItemOrder(
        checklist.id,
        checklistItemOrder,
        manager,
      );
    });
  }
}
