import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dtos/get-user.dto';

export class GetChecklistDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '체크리스트 제목' })
  title: string;

  @ApiProperty({ type: String, example: '체크리스트 이모지' })
  emoji: string;

  @ApiProperty({ type: GetUserDto })
  createdBy: GetUserDto;

  @ApiProperty({ type: GetUserDto })
  updatedBy: GetUserDto;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  updatedAt: Date;
}
