import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChecklistItemDto {
  @ApiProperty({ type: String, description: '체크리스트 항목 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: String, description: '체크리스트 항목 메모' })
  @IsOptional()
  @IsString()
  memo: string;

  @ApiProperty({ type: String, description: '체크리스트 항목 이미지 URL' })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({ type: Boolean, description: '체크리스트 항목 체크 여부' })
  @IsOptional()
  @IsBoolean()
  isChecked: boolean;
}
