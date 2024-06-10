import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './folder.entity';
import { FolderService } from './folder.service';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [TypeOrmModule.forFeature([Folder]), WorkspaceModule],
  providers: [FolderService],
  exports: [FolderService, TypeOrmModule],
  controllers: [],
})
export class FolderModule {}
