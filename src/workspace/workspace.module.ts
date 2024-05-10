import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  providers: [WorkspaceService],
  exports: [WorkspaceService, TypeOrmModule],
  controllers: [],
})
export class WorkspaceModule {}
