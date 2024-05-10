import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async createWorkspace() {
    const workspace = new Workspace();
    workspace.name = '기본 워크스페이스';
    const newWorkspace = await this.workspaceRepository.save(workspace);
    return newWorkspace.id;
  }
}
