import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWorkspace } from './user-workspace.entity';
import { UserService } from '../user/user.service';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    private readonly userService: UserService,
  ) {}

  async findById(workspaceId: number) {
    return this.workspaceRepository.findOne({
      where: { id: workspaceId },
      select: ['name', 'folder_order'],
    });
  }

  async findByUserId(userId: number) {
    const user = await this.userService.findOneUser(userId);
    return this.userWorkspaceRepository.find({
      where: { user },
      relations: ['workspace'],
    });
  }
}
