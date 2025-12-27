import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
