import { Module } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { SidebarController } from './sidebar.controller';
import { WorkspaceModule } from '../workspace/workspace.module';
import { FolderModule } from '../folder/folder.module';
import { ChecklistModule } from '../checklist/checklist.module';

@Module({
  imports: [WorkspaceModule, FolderModule, ChecklistModule],
  providers: [SidebarService],
  exports: [],
  controllers: [SidebarController],
})
export class SidebarModule {}
