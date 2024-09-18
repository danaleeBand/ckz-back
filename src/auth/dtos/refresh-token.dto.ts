import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ type: String, description: '리프레시 토큰' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
