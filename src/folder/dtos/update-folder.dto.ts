import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFolderDto {
  @ApiProperty({ type: String, description: '폴더명' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
