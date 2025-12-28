import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('supabase.supabaseUrl');
    const key = this.configService.get<string>('supabase.supabaseKey');

    this.client = createClient(url, key);
    this.bucket = this.configService.get<string>('supabase.supabaseBucket');
  }

  getClient() {
    return this.client;
  }

  getBucket() {
    return this.bucket;
  }
}
