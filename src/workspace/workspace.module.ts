import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceUserService } from './services/workspace_user.service';
import { WorkspaceUser } from './entities/workspace-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, WorkspaceUser])],
  providers: [WorkspaceService, WorkspaceUserService],
  exports: [WorkspaceService, WorkspaceUserService, TypeOrmModule],
  controllers: [],
})
export class WorkspaceModule {}
