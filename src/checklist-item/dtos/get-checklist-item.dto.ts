import { ApiProperty } from '@nestjs/swagger';

export class GetChecklistItemDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: '제목' })
  title: number;

  @ApiProperty({ type: Number, example: '메모' })
  memo: number;

  @ApiProperty({ type: Number, example: '이모지' })
  emoji: number;

  @ApiProperty({ type: Number, example: '이미지 url' })
  imageUrl: number;

  @ApiProperty({ type: Boolean, example: true })
  isChecked: number;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  checkedAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  updatedAt: Date;
}
