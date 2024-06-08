import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './checklist.entity';
import { ChecklistService } from './checklist.service';
import {FolderModule} from "../folder/folder.module";

@Module({
  imports: [TypeOrmModule.forFeature([Checklist]), FolderModule],
  providers: [ChecklistService],
  exports: [ChecklistService, TypeOrmModule],
  controllers: [],
})
export class ChecklistModule {}
