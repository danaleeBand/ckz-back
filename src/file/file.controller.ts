import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from './file.service';
import { UploadFileResponseDto } from './upload-file-response.dto';

@Controller('file')
@ApiTags('file')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/profile-image')
  @ApiOperation({
    summary: '프로필 이미지 업로드',
    description: '프로필 이미지 업로드',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: '성공', type: UploadFileResponseDto })
  @HttpCode(HttpStatus.OK)
  async uploadFile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    const userId = req.user.id;
    return this.fileService.uploadUserProfile(userId, file);
  }
}
