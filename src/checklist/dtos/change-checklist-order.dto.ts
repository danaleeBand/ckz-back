import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeChecklistOrderDto {
  @ApiProperty({
    type: Number,
    description: '폴더 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  folderId: number;

  @ApiProperty({
    type: Number,
    description: '순서',
  })
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
