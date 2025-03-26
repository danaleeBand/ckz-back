import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChecklistDto {
  @ApiProperty({ type: String, description: '체크리스트 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: String, description: '체크리스트 이모지' })
  @IsOptional()
  @IsString()
  emoji: string;
}
