import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FileService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadUserProfile(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${extension}`;
    const path = `users/${userId}/profile/${fileName}`;

    return this.upload(path, file);
  }

  private async upload(
    path: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const supabase = this.supabaseService.getClient();
    const bucket = this.supabaseService.getBucket();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.getPublicUrl(path, bucket);
  }

  private getPublicUrl(path: string, bucket: string): string {
    const supabase = this.supabaseService.getClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  }
}
