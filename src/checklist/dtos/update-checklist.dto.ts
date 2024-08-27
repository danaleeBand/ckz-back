import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChecklistDto {
  @ApiProperty({ type: String, description: '체크리스트 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
