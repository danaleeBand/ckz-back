import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String, example: '이름' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ type: String, example: '이미지 url' })
  @IsString()
  @IsOptional()
  profile_image_url: string;
}
