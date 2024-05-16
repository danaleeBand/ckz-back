import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WorkspaceModule } from '../workspace/workspace.module';
import { FolderModule } from '../folder/folder.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { QueryRunnerService } from '../common/querry_runner.service';
import { ChecklistItemModule } from '../checklist-item/checklist-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WorkspaceModule,
    FolderModule,
    ChecklistModule,
    ChecklistItemModule,
  ],
  providers: [UserService, QueryRunnerService],
  exports: [UserService, TypeOrmModule, QueryRunnerService],
  controllers: [UserController],
})
export class UserModule {}
