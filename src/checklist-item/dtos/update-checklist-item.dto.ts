import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChecklistItemDto {
  @ApiProperty({ type: String, description: '체크리스트 항목 제목' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ type: String, description: '체크리스트 항목 메모' })
  @IsOptional()
  @IsString()
  memo: string;

  @ApiProperty({ type: String, description: '체크리스트 항목 이모지' })
  @IsOptional()
  @IsString()
  emoji: string;

  @ApiProperty({ type: String, description: '체크리스트 항목 이미지 URL' })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({ type: Boolean, description: '체크리스트 항목 체크 여부' })
  @IsOptional()
  @IsBoolean()
  isChecked: boolean;
}
