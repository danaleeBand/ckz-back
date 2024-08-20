import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ type: Number, description: '워크스페이스 id' })
  @IsNotEmpty()
  @IsNumber()
  workspaceId: number;

  @ApiProperty({ type: String, description: '폴더명' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
