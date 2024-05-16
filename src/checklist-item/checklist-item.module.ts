import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItemService } from './checklist_item.service';
import { ChecklistItem } from './checklist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem])],
  providers: [ChecklistItemService],
  exports: [ChecklistItemService, TypeOrmModule],
})
export class ChecklistItemModule {}
