import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChecklistItemDto {
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
  image_url: string;
}
