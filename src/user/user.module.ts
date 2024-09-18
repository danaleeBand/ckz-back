import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WorkspaceModule } from '../workspace/workspace.module';
import { FolderModule } from '../folder/folder.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { ChecklistItemModule } from '../checklist-item/checklist-item.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WorkspaceModule,
    FolderModule,
    ChecklistModule,
    ChecklistItemModule,
    PermissionModule,
  ],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {}
