import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceUserService } from './services/workspace_user.service';
import { WorkspaceUser } from './entities/workspace-user.entity';
import { WorkspaceController } from './workspace.controller';
import { PermissionModule } from '../permission/permission.module';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceUserRepository } from './repositories/workspace-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, WorkspaceUser]),
    PermissionModule,
  ],
  providers: [
    WorkspaceService,
    WorkspaceRepository,
    WorkspaceUserService,
    WorkspaceUserRepository,
  ],
  exports: [WorkspaceService, WorkspaceUserService, TypeOrmModule],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
