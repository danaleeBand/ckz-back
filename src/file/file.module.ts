import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { FileController } from './file.controller';

@Module({
  imports: [SupabaseModule],
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
