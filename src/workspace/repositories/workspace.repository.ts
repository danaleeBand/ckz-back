import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { UpdateWorkspaceDto } from '../dtos/update-workspace.dto';

@Injectable()
export class WorkspaceRepository extends Repository<Workspace> {
  constructor(private readonly dataSource: DataSource) {
    super(Workspace, dataSource.createEntityManager());
  }

  async findWorkspaceById(id: number): Promise<Workspace> {
    return this.findOne({
      where: { id },
    });
  }

  async createWorkspace(
    name: string,
    permissionCode: string,
    manager: EntityManager,
  ): Promise<Workspace> {
    const workspace = this.create({ name, permissionCode });
    return manager.save(workspace);
  }

  async updateWorkspace(id: number, dto: UpdateWorkspaceDto): Promise<void> {
    const workspace = await this.findWorkspaceById(id);

    Object.assign(workspace, dto);

    await this.save(workspace);
  }
}
