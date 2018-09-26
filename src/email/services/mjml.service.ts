import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';

@Injectable()
export class MjmlService {
  compileToHTML(mjml: string, replacements: { [key: string]: string }): string {
    for (let key in replacements) {
      mjml = mjml.replace(`[[${key}]]`, replacements[key]);
    }

    const result = mjml2html(mjml);
    if (result.errors.length > 0) {
      throw result.errors[0];
    } else {
      return result.html;
    }
  }
}
