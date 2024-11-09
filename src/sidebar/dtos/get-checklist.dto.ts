import { ApiProperty } from '@nestjs/swagger';

export class GetChecklistDto {
  @ApiProperty({
    description: '체크리스트 ID',
    example: 0,
  })
  id: number;

  @ApiProperty({
    description: '체크리스트 제목',
    example: '체크리스트 제목',
  })
  title: string;
}
