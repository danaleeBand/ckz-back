import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async createWorkspace(name: string) {
    const workspace = new Workspace();
    workspace.name = name;
    const newWorkspace = await this.workspaceRepository.save(workspace);
    return newWorkspace.id;
  }
}
