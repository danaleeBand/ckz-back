import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ type: String, example: '파일 url' })
  fileUrl: string;
}
