import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  FileInterceptor,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AssetService } from '../services/asset.service';
import { ImageService } from '../services/image.service';

@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly imageService: ImageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    this.assetService.create(file);
  }

  @Get('/:filename/:width')
  async getFileWithWidth(
    @Param('filename') fullname: string,
    @Param('width') width: string,
    @Res() res,
  ) {
    const match = fullname.match(/\.[^/.]+$/);
    const filename = fullname.replace(/\.[^/.]+$/, '');
    let extension: string;
    if (match && match.length > 0) {
      extension = match[0];
    }

    const fileStream = await this.assetService.findOne(filename, res);
    const result = this.imageService.reformatImage(
      fileStream,
      extension,
      +width,
    );
    res.set('Content-Type', result.mediaType);
    result.stream.pipe(res);
  }

  @Get('/:filename')
  async getFile(@Param('filename') fullname: string, @Res() res) {
    const match = fullname.match(/\.[^/.]+$/);
    const filename = fullname.replace(/\.[^/.]+$/, '');
    let extension: string;
    if (match && match.length > 0) {
      extension = match[0];
    }
    const fileStream = await this.assetService.findOne(filename, res);
    const result = this.imageService.reformatImage(fileStream, extension);
    res.set('Content-Type', result.mediaType);
    result.stream.pipe(res);
  }
}
