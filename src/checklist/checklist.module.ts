import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './checklist.entity';
import { ChecklistService } from './services/checklist.service';
import { ChecklistItemService } from './services/checklist_item.service';
import { ChecklistItem } from './checklist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist, ChecklistItem])],
  providers: [ChecklistService, ChecklistItemService],
  exports: [ChecklistService, ChecklistItemService, TypeOrmModule],
  controllers: [],
})
export class ChecklistModule {}
