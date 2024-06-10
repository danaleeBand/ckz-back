import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItemService } from './checklist_item.service';
import { ChecklistItem } from './checklist_item.entity';
import { ChecklistModule } from '../checklist/checklist.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem]), ChecklistModule],
  providers: [ChecklistItemService],
  exports: [ChecklistItemService, TypeOrmModule],
})
export class ChecklistItemModule {}
