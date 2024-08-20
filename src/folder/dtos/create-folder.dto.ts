import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ type: String, description: '폴더명' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
