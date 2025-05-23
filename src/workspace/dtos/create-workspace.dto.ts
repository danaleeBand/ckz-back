import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({ type: String, example: '워크스페이스명' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
