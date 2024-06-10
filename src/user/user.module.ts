import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WorkspaceModule } from '../workspace/workspace.module';
import { FolderModule } from '../folder/folder.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { ChecklistItemModule } from '../checklist-item/checklist_item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WorkspaceModule,
    FolderModule,
    ChecklistModule,
    ChecklistItemModule,
  ],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {}
