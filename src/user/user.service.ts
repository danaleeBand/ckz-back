import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { FolderService } from '../folder/folder.service';
import { ChecklistItemService } from '../checklist-item/checklist_item.service';
import { WorkspaceUserService } from '../workspace/services/workspace_user.service';
import { ChecklistService } from '../checklist/checklist.service';

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
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const { name: userName, profile_image_url: profileImageUrl } =
      updateUserDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.is_checky) {
      await this.createSampleData(user);
    }

    user.name = userName;
    user.profile_image_url = profileImageUrl;
    user.is_checky = true;
    await this.userRepository.save(user);
  }

  async createSampleData(user: User) {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const workspace = await this.workspaceService.createWorkspace(
        '기본 워크스페이스',
        manager,
      );
      const workspaceUser = await this.workspaceUserService.createWorkspaceUser(
        user,
        workspace,
        manager,
      );
      const folder = await this.folderService.createFolder(
        workspace,
        '기본 폴더',
        true,
        manager,
      );
      const checklist = await this.checklistService.createChecklist(
        '기본 체크리스트',
        folder,
        manager,
      );
      const checklistItemList = [
        '체키가 되기',
        '친구들과 워크스페이스 생성하기',
        '체크리스트 작성하기',
      ];
      const checklistItemOrder = [];
      const promises = checklistItemList.map(async (title) => {
        const checklistItem = this.checklistItemService.createChecklistItem(
          title,
          checklist,
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
