import { Controller, Post, Body } from '@nestjs/common';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { MjmlService } from '../services/mjml.service';

@Controller('mjml')
export class MjmlController {
  constructor(private mjmlService: MjmlService) {}

  @Post('compile')
  @Roles('admin')
  uploadFile(@Body() body) {
    return {
      html: this.mjmlService.compileToHTML(body.mjml, body.replacements),
    };
  }
}
