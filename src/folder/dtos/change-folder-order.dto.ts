import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeFolderOrderDto {
  @ApiProperty({
    type: Number,
    description: '순서',
  })
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
