import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChecklistItemDto {
  @ApiProperty({ type: String, description: '체크리스트 항목 제목' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
