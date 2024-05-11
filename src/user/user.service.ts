import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { WorkspaceService } from '../workspace/services/workspace.service';
import { FolderService } from '../folder/folder.service';
import { ChecklistService } from '../checklist/services/checklist.service';
import { ChecklistItemService } from '../checklist/services/checklist_item.service';
import { QueryRunnerService } from '../common/querry_runner.service';
import {WorkspaceUserService} from "../workspace/services/workspace_user.service";

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
    private queryRunnerService: QueryRunnerService,
  ) {}

  async createUser(userName) {
    const user = new User();
    user.name = userName;
    const newUser = await this.userRepository.save(user);
    return newUser.id;
  }

  async findOneUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'profile_image_url', 'is_checky'],
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
      await this.createSampleData(userId);
    }

    user.name = userName;
    user.profile_image_url = profileImageUrl;
    user.is_checky = true;
    await this.userRepository.save(user);
  }

  async createSampleData(userId: number) {
    await this.queryRunnerService.startTransaction();

    try {
      const workspaceId =
        await this.workspaceService.createWorkspace('기본 워크스페이스');
      const workspaceUser = await this.workspaceUserService.createWorkspaceUser(
        userId,
        workspaceId,
      );
      const folderId = await this.folderService.createFolder(
        workspaceId,
        '기본 폴더',
        true,
      );
      const checklistId = await this.checklistService.createChecklist(
        '기본 체크리스트',
        folderId,
      );
      const checklistItemList = [
        '체키가 되기',
        '친구들과 워크스페이스 생성하기',
        '체크리스트 작성하기',
      ];
      const promises = checklistItemList.map(async (title) => {
        return this.checklistItemService.createChecklistItem(
          title,
          checklistId,
        );
      });
      await Promise.all(promises);

      await this.queryRunnerService.commitTransaction();
    } catch (error) {
      await this.queryRunnerService.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunnerService.releaseQueryRunner();
    }
  }
}
