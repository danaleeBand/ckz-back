import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './checklist.entity';
import { ChecklistService } from './checklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Checklist])],
  providers: [ChecklistService],
  exports: [ChecklistService, TypeOrmModule],
  controllers: [],
})
export class ChecklistModule {}
