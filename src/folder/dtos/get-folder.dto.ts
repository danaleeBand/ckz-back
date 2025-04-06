import { ApiProperty } from '@nestjs/swagger';

export class GetFolderDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: '폴더 명' })
  name: number;

  @ApiProperty({ type: Boolean, example: true })
  isDefault: boolean;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  updatedAt: Date;
}
