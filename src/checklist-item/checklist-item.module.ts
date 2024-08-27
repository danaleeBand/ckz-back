import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItemService } from './checklist-item.service';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistModule } from '../checklist/checklist.module';
import { ChecklistItemController } from './checklist-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem]), ChecklistModule],
  providers: [ChecklistItemService],
  exports: [ChecklistItemService, TypeOrmModule],
  controllers: [ChecklistItemController],
})
export class ChecklistItemModule {}
