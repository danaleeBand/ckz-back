import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './checklist.entity';
import { ChecklistService } from './checklist.service';
import { FolderModule } from '../folder/folder.module';
import { ChecklistController } from './checklist.controller';
import { ChecklistItemModule } from '../checklist-item/checklist-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checklist]),
    forwardRef(() => FolderModule),
    forwardRef(() => ChecklistItemModule),
  ],
  providers: [ChecklistService],
  exports: [ChecklistService, TypeOrmModule],
  controllers: [ChecklistController],
})
export class ChecklistModule {}
