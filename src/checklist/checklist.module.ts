import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './checklist.entity';
import { ChecklistService } from './checklist.service';
import { FolderModule } from '../folder/folder.module';
import { ChecklistController } from './checklist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist]), FolderModule],
  providers: [ChecklistService],
  exports: [ChecklistService, TypeOrmModule],
  controllers: [ChecklistController],
})
export class ChecklistModule {}
