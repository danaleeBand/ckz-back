import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceUser } from '../entities/workspace-user.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceUser)
    private readonly userWorkspaceRepository: Repository<WorkspaceUser>,
  ) {}

  async createWorkspace(name: string) {
    const workspace = new Workspace();
    workspace.name = name;
    const newWorkspace = await this.workspaceRepository.save(workspace);
    return newWorkspace;
  }

  async findById(workspaceId: number) {
    return this.workspaceRepository.findOne({
      where: { id: workspaceId },
      select: ['name', 'folder_order'],
    });
  }

  async findByUserId(userId: number) {
    return this.userWorkspaceRepository.find({
      where: { user: { id: userId } },
      relations: ['workspace'],
    });
  }
}
