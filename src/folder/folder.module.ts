import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './folder.entity';
import { FolderService } from './folder.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { FolderController } from './folder.controller';
import { ChecklistModule } from '../checklist/checklist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder]),
    WorkspaceModule,
    forwardRef(() => ChecklistModule),
  ],
  providers: [FolderService],
  exports: [FolderService, TypeOrmModule],
  controllers: [FolderController],
})
export class FolderModule {}
