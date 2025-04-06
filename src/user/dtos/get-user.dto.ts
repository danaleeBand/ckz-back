import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '이름' })
  name: string;

  @ApiProperty({ type: String, example: '프로필 이미지' })
  profileImageUrl: string;

  @ApiProperty({ type: Boolean, example: '체키 여부' })
  isChecky: boolean;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  updatedAt: Date;
}
